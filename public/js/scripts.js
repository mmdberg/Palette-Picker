
const randomColorGenerator = () => {

  var randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16);
  $('.box1').css('background-color', randomColor1)

  var randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16);
  $('.box2').css('background-color', randomColor2)

  var randomColor3 = '#' + Math.floor(Math.random()*16777215).toString(16);
  $('.box3').css('background-color', randomColor3)

  var randomColor4 = '#' + Math.floor(Math.random()*16777215).toString(16);
  $('.box4').css('background-color', randomColor4)

  var randomColor5 = '#' + Math.floor(Math.random()*16777215).toString(16);
  $('.box5').css('background-color', randomColor5)

  const colorArray = [randomColor1, randomColor2, randomColor3, randomColor4, randomColor5]
  console.log(colorArray);
}

$('.new-palette-button').click(randomColorGenerator)