var noiseSynth = new Tone.Noise({
  type: 'pink',
  playbackRate: 1,
  fadeIn: 0.05,
  fadeOut: 0.05
})

var fmSynth = new Tone.FMSynth({
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

var synth = fmSynth
const context = Tone.context
const synthGain = new Tone.Gain(0.9)
const synthPan = new Tone.Panner(0).toMaster()
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


const mappings = {
  '1': function(position) {
    console.log('Current time is:', context.currentTime)
    var value = { mod: scaling.scale(position.y, 4.0, 0.0, canvas.height, 0),
      freq: scaling.closest(scaling.logscale(position.x, 100, 3500, 0, canvas.width)) }
    audio.change('freq', value.freq)
    audio.change('mod', value.mod)
    console.log('Current time is:', context.currentTime)
  },
  '2': function(position) {
    var value = { pan: scaling.scale(position.x, -1.0, 1.0, 0, canvas.width),
      freq: scaling.closest(scaling.logscale(position.y, 100, 3500, 0, canvas.height))}
    audio.change('pan', value.pan)
    audio.change('freq', value.freq)
  }
}

const audio = {
  play: function () { synth.triggerAttack(synth.frequency.value) },
  stop: function () { synth.triggerRelease() },
  switch: function (synthType) {
    switch (synthType) {
      case 'noise':
        synth = noiseSynth
        break
      default:
        synth = fmSynth
        break
    }
    synth.connect(synthGain)
  }, // Switches between FMSynth and Noise.
  change: function (parameter, value) {
    console.log(context.currentTime, context.currentTime + 1)
    switch (parameter) {
      case 'freq':
        synth.frequency.linearRampToValueAtTime(value, (context.currentTime + 1))
        synth.frequency.setValueAtTime(value, (context.currentTime + 1))
        break
      case 'gain':
        synthGain.gain.linearRampToValueAtTime(value, (context.currentTime + 1))
        synthGain.gain.setValueAtTime(value, (context.currentTime + 1))
        break
      case 'pan':
        synthPan.pan.linearRampToValueAtTime(value, (context.currentTime + 1))
        synthPan.pan.setValueAtTime(value, (context.currentTime + 1))
        break
      case 'mod':
        synth.harmonicity.linearRampToValueAtTime(value, (context.currentTime + 1))
        synth.modulationIndex.linearRampToValueAtTime((value * 5), (context.currentTime + 1))
        synth.modulationIndex.setValueAtTime((value * 5), (context.currentTime + 1))
        break
    }
  }
}

function selectChange (mappingVal) {
  audio.switch()
  mouseEventHandler = mappings[mappingVal]
  switch (mappingVal) {
    case '1': // Mapping value is one (freq:modulation).
      audio.change('pan', 0)
      break
    case '2':
      audio.change('gain', 0.5)
      audio.change('mod', 0)
      break
  }
}

  /*mapping = selectedValue;
  changeSynth('synth');
  resetCanvas();

  switch(selectedValue) {
    case '1':
      console.log('Mapping one.');
      audio.change('pan', 0);
      var mouseFunc = mapOne;
      break;

    case '2':
      console.log('Mapping two.');
      audio.change('gain', 0.5);
      audio.change('modulation', 0);
      var mouseFunc = mapTwo;
      break;

    case '3':
      changeSynth('noise');
      console.log('Mapping three');
      var mouseFunc = mapThree;
      break;

    case '4':
      console.log('Mapping four');
      audio.change('modulation', 0);
      audio.change('gain', 0.5);
      audio.change('pan', 0);
      audio.change('frequency', 0);
      var mouseFunc = mapFour;
      break;
    }
    mouseEventHandler = mouseFunc;*/
