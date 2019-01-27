var noiseSynth = new Tone.Noise({ // Pink noise output, it's possible this should be white - but pink is more tonally appealing.
  type: 'pink',
  playbackRate: 1,
  fadeIn: 0.05,
  fadeOut: 0.05
})

var fmSynth = new Tone.FMSynth({ // Frequency modulated synth, triangle <- square.
  oscillator: { type: 'triangle' },
  harmonicity: 2,
  modulationIndex: 0,
  modulation: { type: 'square' },
  envelope: {
    attack: 0.2,
    decay: 0.2,
    sustain: 0.2,
    release: 0.2
  }
})

var synth = fmSynth // Active output audio node is 'synth', defaults as the fm synth.
const context = Tone.context // 'Context' is the webAudioAPI backbone, used primarily for timing here.
const synthGain = new Tone.Gain(0.9) // Gain node.
const synthPan = new Tone.Panner(0).toMaster() // Panner node.
synthGain.connect(synthPan)
synth.connect(synthGain)
const notes = [103.83, 110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 174.61,
  185.00, 196.00, 207.65, 220.00, 233.08, 246.94, 261.63, 277.18, 293.66,
  311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
  523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61,
  880.00, 932.33, 987.77, 1046.50, 1108.73, 1174.66, 1244.51, 1318.51,
  1396.91, 1479.98, 1567.98, 1661.22, 1760.00, 1864.66, 1975.53,
  20.2, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96,
  3135.96, 3322.44, 3520.00] // Notes fixed at frequencies of musical pitch.


const mappings = { // Each mapping is a set of instructions in a function, each scales an input and uses the output to alter audio parameters.
  '1': function (position) {
    var value = { mod: scaling.scale(position.y, 4.0, 0.0, canvas.height, 0),
      freq: scaling.closest(scaling.logscale(position.x, 100, 3500, 0, canvas.width)) }
    audio.change('freq', value.freq)
    audio.change('mod', value.mod)
  },
  '2': function (position) {
    var value = { pan: scaling.scale(position.x, -1.0, 1.0, 0, canvas.width),
      freq: scaling.closest(scaling.logscale(position.y, 100, 3500, 0, canvas.height))}
    audio.change('pan', value.pan)
    audio.change('freq', value.freq)
  },
  '3': function (position) {
    var value = { pan: scaling.scale(position.x, -1.0, 1.0, 0, canvas.width),
      gain: scaling.scale(position.y, 0.3, 0.0, canvas.height, 0) }
    audio.change('pan', value.pan)
    audio.change('gain', value.gain)
  },
  '4': function (position) { // Slightly more complex: Outputs at a fixed time interval calculated using the max and min x values to playback the recorded user input.
    function alterAudio (y, interval) {
      var value = { time: interval / 1000, // Interval is divided by 1000 to turn it into seconds (for addition to context time param).
        freq: scaling.closest(scaling.logscale(y, 100, 3500, 0, canvas.height))
      }
      audio.change('time', value) // Scales freq over time.
    }

    var len = position.x.length // Position is an object of arrays.
    var timeValues = { min: scaling.scale(arrayTools.min(position.x), 0, 8000, 0, canvas.width),
      max: scaling.scale(arrayTools.max(position.x), 0, 8000, 0, canvas.width),
      initial: scaling.scale(position.x[0], 0, 8000, 0, canvas.width)
    } // Find the min, max and first time value (initial wait for audio playback).
    timeValues.total = (timeValues.max - timeValues.min) + timeValues.initial // Should really just be max, as initial and min will usually be the same, unless the user folds back on themselves - left this way as a precaution.
    timeValues.interval = (timeValues.total / len) // Total time divided by the number of changes results in the interval time in ms.
    var i = 1 // Index.

    setTimeout(function () { // After an initial wait, start audio playback.
      audio.play()
      alterAudio(position.y[0], timeValues.interval) // Run the first audio 'packet' from the array (first frequency over zero seconds - instant).
      var play = setInterval(function () { // Every x ms, run the alterAudio function, ramping to the next frequency value over the interval time.
        if (i <= len) {
          alterAudio(position.x[i], position.x[i - 1], position.y[i], timeValues.interval)
          i = i + 1
        } else { clearInterval(play) } // When the whole array has been converted and played, clear the interval to stop the function.
      }, timeValues.interval)
    }, timeValues.initial)

    setTimeout(function () { // This should line up with the timeout function, stopping the audio - acts mainly as a safeguard.
      audio.stop()
    }, timeValues.total)
  }
}

const audio = {
  play: function () { synth.triggerAttack(synth.frequency.value) },
  stop: function () { synth.triggerRelease() },
  switch: function (synthType) { // Switches to noise if given the input, otherwise just set to the default synth.
    switch (synthType) {
      case 'noise':
        synth = noiseSynth
        this.stop = function () { synth.stop() }
        this.play = function () { synth.start() }
        break
      default:
        synth = fmSynth
        this.stop = function () { synth.triggerRelease() },
        this.play = function () { synth.triggerAttack(synth.frequency.value) } // Replace start and stop due to different absractions.
        break
    }
    synth.connect(synthGain)
  },
  change: function (parameter, value) { // Rampps use currentTime + 0.1 to smooth the transition between values (interpolation).
    switch (parameter) {
      case 'freq':
        synth.frequency.linearRampToValueAtTime(value, (context.currentTime + 0.1))
        synth.frequency.setValueAtTime(value, (context.currentTime + 0.1))
        break
      case 'gain':
        synthGain.gain.linearRampToValueAtTime(value, (context.currentTime + 0.1))
        synthGain.gain.setValueAtTime(value, (context.currentTime + 0.1))
        break
      case 'pan':
        synthPan.pan.linearRampToValueAtTime(value, (context.currentTime + 0.1))
        synthPan.pan.setValueAtTime(value, (context.currentTime + 0.1))
        break
      case 'mod':
        synth.harmonicity.linearRampToValueAtTime(value, (context.currentTime + 0.1))
        synth.modulationIndex.linearRampToValueAtTime((value * 5), (context.currentTime + 0.1))
        synth.modulationIndex.setValueAtTime((value * 5), (context.currentTime + 0.1))
        break
      case 'time':
        synth.frequency.linearRampToValueAtTime(value.freq, context.currentTime + value.time)
        synth.frequency.setValueAtTime(value.freq, context.currentTime + value.time)
        break
    }
  }
}

function mappingChange (mappingVal) {
  audio.switch() // Switch to default, will switch to noise if mapping is 3.
  if (mappingVal != null) { var mouseEventHandler = mappings[mappingVal] }
  switch (mappingVal) {
    case '1': // Mapping value is one (freq:modulation).
      audio.change('pan', 0)
      break
    case '2':
      audio.change('gain', 0.5)
      audio.change('mod', 0)
      break
    case '3':
      audio.switch('noise')
      break
    case '4':
      audio.change('modulation', 0)
      audio.change('gain', 0.5)
      audio.change('pan', 0)
      audio.change('frequency', 0)
      break
  }
  return [mappingVal, mouseEventHandler]
}
