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
    attack: 0.1,
    decay: 0.1,
    sustain: 0.1,
    release: 0.1
  }
})

var synth = fmSynth
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
  2093.00, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96,
  3135.96, 3322.44, 3520.00] // Notes fixed at frequencies of musical pitch.

const audio = {
  play: function () { synth.triggerAttack(synth.frequency.value) },
  stop: function () { synth.triggerRelease() },
  change: function (synthType) {
    switch (synthType) {
      case 'noise':
        synth = noiseSynth
        break
      default:
        synth = fmSynth
        break
    }
    synth.connect(synthGain)
  } // Switches between FMSynth and Noise.
}
