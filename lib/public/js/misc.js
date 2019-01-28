const scaling = {
  logscale: function(value, minval, maxval, minpos, maxpos) {
    var scale = (Math.log(maxval) - Math.log(minval)) / (maxpos - minpos)
    return Math.exp(Math.log(minval) + scale * (value - minpos))
  },
  scale: function (unscaledNum, minAllowed, maxAllowed, min, max) {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed
  },
  closest: function (value) {
    return notes.reduce(function (prev, curr) {
      return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev)
    })
  }
}

const arrayTools = {
  min: function (array) { return Math.min.apply(null, array) },
  max: function (array) { return Math.max.apply(null, array) }
}

var mappingDesc = {
  '1': 'X: Frequency (100Hz - 3.5kHz), Y: Tone modulation.',
  '2': 'X: Localisation (0-180 azimuth degrees), Y: Frequency (100Hz - 3.5kHz).',
  '3': 'X: Localisation (0-180 azimuth degrees), Y: Loudness (0-1).',
  '4': 'X: Playback time (0-8s), Y: Frequency(100Hz - 3.5kHz).'
}

$(document).ready(function () {
  $('#mappingChanger').val('1')
  $('#mappingDescription').html(mappingDesc[$('#mappingChanger').val()])
})

$('#mappingChanger').change(function () {
  $('#mappingDescription').html(mappingDesc[$('#mappingChanger').val()])
  getMapping($('#mappingChanger').val())
})

$('#playButton').click(function () {
  $('#playButton').attr("disabled", true); // Set the button to be disabled/off until playback is finished.
  $.get((window.location + "/play"), function(data) {
    var data = JSON.parse(data)
    playJSON(data)
  })
})

$('#submitButton').click(function () {
  if (userCoords == null || userCoords.x.length <= 0) {
    alert('Play the buffer, then draw the path you can hear before submitting!')
  } else {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userCoords),
      dataType: 'json',
      url: (window.location + '/submit')
    })
    resetCanvas()
  }
})
