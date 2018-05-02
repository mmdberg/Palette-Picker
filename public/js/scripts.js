let colorArray = []

const randomColorGenerator = () => {
  $('.drop-shadow').css('visibility', 'initial')
  const numArray = [1, 2, 3, 4, 5]
  colorArray = []
  for(let i = 1; i <= 5; i++) {
    if(!$(`.box${i}`).hasClass('locked')) {
      colorArray.push('#' + Math.floor(Math.random()*16777215).toString(16));
    } else {
      colorArray.push($(`.color${i}`).text())
    }
    
  }

  console.log('colors', colorArray);
  // numArray.forEach((number, i) => {
  // })

  colorArray.forEach((color, i) => {
    $(`.box${i + 1}`).css('background-color', color)
    $(`.lock-button${i + 1}`).css('background-color', color)
    $(`.color${i + 1}`).text(color)
  })
}

const handleLock = (num) => {
  $(`.box${num}`).toggleClass('locked')
}

const savePalette = async () => {
  const paletteName = ($('.palette-name-input').val())
  const project_id = ($('.project-options').val())
  const response = await fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({
      title: paletteName,
      color1: colorArray[0],
      color2: colorArray[1],
      color3: colorArray[2],
      color4: colorArray[3],
      color5: colorArray[4],
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
    <div class="palette-swatch swatchColor1" style='background-color:${colorArray[0]}'></div>
    <div class="palette-swatch swatchColor2" style='background-color:${colorArray[1]}'></div>
    <div class="palette-swatch swatchColor3" style='background-color:${colorArray[2]}'></div>
    <div class="palette-swatch swatchColor4" style='background-color:${colorArray[3]}'></div>
    <div class="palette-swatch swatchColor5" style='background-color:${colorArray[4]}'></div>
  </article>`)
  ($('.palette-name-input').val('')) 
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
  const color2 = ($(palette).find('.swatchColor2').attr('id'))
  const color3 = ($(palette).find('.swatchColor3').attr('id'))
  const color4 = ($(palette).find('.swatchColor4').attr('id'))
  const color5 = ($(palette).find('.swatchColor5').attr('id'))

  let colorArray = [color1, color2, color3, color4, color5]

  colorArray.forEach((color, i) => {
    $(`.box${i + 1}`).css('background-color', color)
    $(`.lock-button${i + 1}`).css('background-color', color)
    $(`.color${i + 1}`).text(color)
  })
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


