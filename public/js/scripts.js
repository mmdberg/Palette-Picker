var randomColor1;
var randomColor2;
var randomColor3;
var randomColor4;
var randomColor5;

const randomColorGenerator = () => {

  $('.drop-shadow').css('visibility', 'initial')

  if(!$('.box1').hasClass('locked')) {
    randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box1').css('background-color', randomColor1)
    $('.lock-button1').css('background-color', randomColor1)
    $('.color1').text(randomColor1)
  } else {
    randomColor1 = $('.color1').text()
  }

  if(!$('.box2').hasClass('locked')) {
    randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box2').css('background-color', randomColor2)
    $('.lock-button2').css('background-color', randomColor2)
    $('.color2').text(randomColor2)
  } else {
    randomColor2 = $('.color2').text()
  }

  if(!$('.box3').hasClass('locked')) {
    randomColor3 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box3').css('background-color', randomColor3)
    $('.lock-button3').css('background-color', randomColor3)
    $('.color3').text(randomColor3)
  } else {
    randomColor3 = $('.color3').text()
  }

  if(!$('.box4').hasClass('locked')) {
    randomColor4 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box4').css('background-color', randomColor4)
    $('.lock-button4').css('background-color', randomColor4)
    $('.color4').text(randomColor4)
  } else {
    randomColor4 = $('.color4').text()
  }

  if(!$('.box5').hasClass('locked')) {
    randomColor5 = '#' + Math.floor(Math.random()*16777215).toString(16);
    $('.box5').css('background-color', randomColor5)
    $('.lock-button5').css('background-color', randomColor5)
    $('.color5').text(randomColor5)
  } else {
    randomColor5 = $('.color5').text()
  }

  const colorArray = [randomColor1, randomColor2, randomColor3, randomColor4, randomColor5]
  colorArray.forEach(color => {

  })
  console.log(colorArray);
}

const handleLock = (num) => {
  $(`.box${num}`).toggleClass('locked')
}

const savePalette = async () => {
  const paletteName = ($('.palette-name-input').val())
  const project_id = ($('.project-options').val())
  console.log(project_id)
  const response = await fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({
      title: paletteName,
      color1: randomColor1,
      color2: randomColor2,
      color3: randomColor3,
      color4: randomColor4,
      color5: randomColor5,
      project_id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const paletteResponse = await response.json()
  const paletteID = paletteResponse.id
  $(`#${project_id}`).after(
  `<article class="palette-list">
    <p>${paletteName}</p>
    <div class="palette-swatch swatchColor1" style='background-color:${randomColor1}''></div>
    <div class="palette-swatch swatchColor2" style='background-color:${randomColor2}''></div>
    <div class="palette-swatch swatchColor3" style='background-color:${randomColor3}''></div>
    <div class="palette-swatch swatchColor4" style='background-color:${randomColor4}''></div>
    <div class="palette-swatch swatchColor5" style='background-color:${randomColor5}''></div>
  </article>`)
}

const addProject = async (projectName) => {
  try {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: projectName
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const projectResponse = await response.json()
    const projectID = projectResponse.id
    $('.project-list').append(`<h4>${projectName}</h4>
      <p class="no-palettes-saved">No palattes saved for this project<p>`)
    $('.project-options').append(`<option value="${projectID}">${projectName}</option>`)
  } catch (error) {
    console.log('add project to db error:', error)
  }
}

const saveProject = async () => {
  const projectName = ($('.project-name-input').val())
  try { 
    const response = await fetch('/api/v1/projects')
    const projects = await response.json()
    const projectMatch = projects.find(project => project.title === projectName)
    if (projectMatch) {
      $('.save-project-button').after('<p class="project-match">That project name already exists</p>')
    } else {
      $('.project-match').remove()
      addProject(projectName)
    }
    ($('.project-name-input').val(''))
  } catch (error) {
    console.log('project match test error:', error)
  }
}

const getPalettes = async (id) => {
  try {
    const response = await fetch(`/api/v1/palettes/${id}`)
    const palettes = await response.json()
    return palettes
  } catch (error) {
    console.log('getPalettes error:', error)
  }
}

const makeArray = (projects) => {
  const projectArray = projects.map(async project => {
    const colors = await getPalettes(project.id)
    const projectObject = {colors, title: project.title, id: project.id}
    return projectObject
  })
  return Promise.all(projectArray)
}

const makeDropdown = (projectArray) => {
  projectArray.forEach(project => {
    $('.project-options').append(`<option value="${project.id}">${project.title}</option>`)
  })
}

const showProjects = (projectArray) => {
  projectArray.forEach(project => {
    if (project.colors.length > 1) { 
      $('.project-list').append(`<h4 id="${project.id}">${project.title}</h4>`)
      project.colors.forEach(palette =>   
      $('.project-list').append(
        `<article class="palette-list">
          <p>${palette.title}</p>
          <div class="palette-swatch swatchColor1" id='${palette.color1}' style='background-color:${palette.color1}''></div>
          <div class="palette-swatch swatchColor2" id='${palette.color2}' style='background-color:${palette.color2}''></div>
          <div class="palette-swatch swatchColor3" id='${palette.color3}' style='background-color:${palette.color3}''></div>
          <div class="palette-swatch swatchColor4" id='${palette.color4}' style='background-color:${palette.color4}''></div>
          <div class="palette-swatch swatchColor5" id='${palette.color5}' style='background-color:${palette.color5}''></div>
        </article>`))
    } else {
      $('.project-list').append(`<h4>${project.title}</h4>
        <p class="no-palettes-saved">No palattes saved for this project<p>`)
    }
  })
}

const loadProjects = async () => {
  try {
    const response = await fetch('/api/v1/projects')
    const projects = await response.json()
    const projectArray = await makeArray(projects)
    console.log('projectArray', projectArray);
    makeDropdown(projectArray)
    showProjects(projectArray)
    return projectArray
  } catch (error) {
    console.log('loadProjects error:', error)
  }
}

const displaySavedPalette = (event) => {
  const palette = (event.target.closest('article'))
  const color1 = ($(palette).find('.swatchColor1').attr('id'))
  $('.box1').css('background-color', color1)
  $('.lock-button1').css('background-color', color1)
  $('.color1').text(color1)

  const color2 = ($(palette).find('.swatchColor2').attr('id'))
  //const color1 = convertRGBtoHex(color1RGB)
  $('.box2').css('background-color', color2)
  $('.lock-button2').css('background-color', color2)
  $('.color2').text(color2)

  const color3 = ($(palette).find('.swatchColor3').attr('id'))
  $('.box3').css('background-color', color3)
  $('.lock-button3').css('background-color', color3)
  $('.color3').text(color3)

  const color4 = ($(palette).find('.swatchColor4').attr('id'))
  $('.box4').css('background-color', color4)
  $('.lock-button4').css('background-color', color4)
  $('.color4').text(color4)

  const color5 = ($(palette).find('.swatchColor5').attr('id'))
  $('.box5').css('background-color', color5)
  $('.lock-button5').css('background-color', color5)
  $('.color5').text(color5)

  let colorArray = [color1, color2, color3, color4, color5]
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
$(this).click(() => displaySavedPalette(event))



