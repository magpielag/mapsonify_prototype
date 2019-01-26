var mappingDesc = {
  '1': 'X: Frequency (100Hz - 3.5kHz), Y: Tone modulation.',
  '2': 'X: Localisation (0-180 azimuth degrees), Y: Frequency (100Hz - 3.5kHz).',
  '3': 'X: Localisation (0-180 azimuth degrees), Y: Loudness (0-1).',
  '4': 'X: Playback time (0-8s), Y: Frequency(100Hz - 3.5kHz).'
}

$(document).ready(function () {
  $('#mappingDescription').html(mappingDesc[$('#mappingChanger').val()])
})

$('#mappingChanger').change(function () {
  $('#mappingDescription').html(mappingDesc[$('#mappingChanger').val()])
})
