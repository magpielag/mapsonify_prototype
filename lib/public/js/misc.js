window.jsonCounter = 0 // Index for json submissions.

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
  var mappingInfo = { mapping: $(this).val() }
  $('#mappingDescription').html(mappingDesc[mappingInfo.mapping])
  getMapping(mappingInfo.mapping)
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(mappingInfo),
    dataType: 'json',
    url: (window.location + '/updatemap')
  })
})

$('#playButton').click(function () {
  $('#playButton').attr('disabled', true) // Set the button to be disabled/off until playback is finished.
  $.get((window.location +  '/play'), function (data) {
    console.log(data)
    if (data.error != null) {
      alert('You have submitted all six guesses for this mapping, please switch mapping using the dropdown below!')
      $('#playButton').attr('disabled', false) // Tell the user to swap then undisable the button.
    } else {
      console.log(data)
      var data = JSON.parse(data)
      playJSON(data)
    }
  })
})

$('#submitButton').click(function () {
  // Add check to see if all submits on mapping n are fufilled (this is probably best to do with an object in server.js with an int for each mapping)
  // Maybe add get to see number of submits for active mapping, if too high, stop and return error to the user.
  if (userCoords == null || userCoords.x.length <= 0) {
    alert('Play the buffer, then draw the path you can hear before submitting!')
  } else {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userCoords),
      dataType: 'json',
      url: (window.location + '/submit'),
      error: function (res) {
        if (res.status == 500) {
          alert('All submissions complete for this mapping, please switch to another mapping using the dropdown below.')
          $('#submitButton').attr('disabled', false)
        }
   }
  })
    resetCanvas()
    ++window.jsonCounter // Index for json playback.

    //if (window.jsonCounter === 5) { alert('All approximations complete, thank you!') }
  }
})
