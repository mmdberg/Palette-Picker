
const randomColorGenerator = () => {

  $('.drop-shadow').css('visibility', 'initial')

  if(!$('.box1').hasClass('locked')) {
    var randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box1').css('background-color', randomColor1)
    $('.lock-button1').css('background-color', randomColor1)
    $('.color1').text(randomColor1)
  } else {
    randomColor1 = $('.color1').text()
  }

  if(!$('.box2').hasClass('locked')) {
    var randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box2').css('background-color', randomColor2)
    $('.lock-button2').css('background-color', randomColor2)
    $('.color2').text(randomColor2)
  } else {
    randomColor2 = $('.color2').text()
  }

  if(!$('.box3').hasClass('locked')) {
    var randomColor3 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box3').css('background-color', randomColor3)
    $('.lock-button3').css('background-color', randomColor3)
    $('.color3').text(randomColor3)
  } else {
    randomColor3 = $('.color3').text()
  }

  if(!$('.box4').hasClass('locked')) {
    var randomColor4 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box4').css('background-color', randomColor4)
    $('.lock-button4').css('background-color', randomColor4)
    $('.color4').text(randomColor4)
  } else {
    randomColor4 = $('.color4').text()
  }

  if(!$('.box5').hasClass('locked')) {
    var randomColor5 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box5').css('background-color', randomColor5)
    $('.lock-button5').css('background-color', randomColor5)
    $('.color5').text(randomColor5)
  } else {
    randomColor4 = $('.color5').text()
  }

  const colorArray = [randomColor1, randomColor2, randomColor3, randomColor4, randomColor5]
  console.log(colorArray);
}

const handleLock = (num) => {
  $(`.box${num}`).toggleClass('locked')
}

const savePalette = () => {
  console.log($('.palette-name-input').val())
}

const saveProject = async () => {
  const project = ($('.project-name-input').val())
  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    body: {
      project
    }
  })
}

const loadProjects = async () => {
  console.log('gimme projects')
  try {
    const response = await fetch('/api/v1/projects')
    console.log('response', response)
    const projects = await response.json()
    console.log('projects', projects)
  } catch (error) {
    console.log('error', error);
  }
}

loadProjects()
$('.new-palette-button').click(randomColorGenerator)
$('.drop-shadow1').click(() => handleLock(1))
$('.drop-shadow2').click(() => handleLock(2))
$('.drop-shadow3').click(() => handleLock(3))
$('.drop-shadow4').click(() => handleLock(4))
$('.drop-shadow5').click(() => handleLock(5))
$('.save-palette-button').click(savePalette)
$('.save-project-button').click(saveProject)