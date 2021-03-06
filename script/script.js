
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/jtHRtt-jR/";

let model, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();


}



// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  var image = document.getElementById('meat-image');
  const prediction = await model.predict(image, false);
  prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
  $("#percent-text").html("<p>예측 결과는 다음과 같습니다.</p>");
  
  for (let i = 0; i < 5; i++) {
    var percentBar = "<div class='skillbar clearfix' data-percent='" + Math.round(prediction[i].probability * 100) + "%'>"
      + "<div class='bar-title'>"
      + "<div class='skillbar-title' style='background: #d35400;'>"
      + "<span>" + classChange(prediction[i].className) + "</span>"
      + "</div>"
      + "</div>"
      + "<div class='bar-area'>"
      + "<div class='skillbar-bar' style='background: #e67e22; width:0px'></div>"
      + "<div class='skill-bar-percent'>" + Math.round(prediction[i].probability * 100) + "%</div>"
      + "</div>"
      + "</div>";
      
    if (Math.round(prediction[i].probability * 100) > 10) {
      $("#percent-area").append(percentBar);
      
    }
    $("#result-area").html("<p>판별 결과</p>"+classChange(prediction[0].className) + resultText(prediction[0].probability * 100));
  

  }
  if (Math.round(prediction[0].probability * 100) < 70) {
    $("#percent-notice").append("<p style='font-size:1em;'>참고 : 70% 이하는 예측정확성이 떨어집니다.</p>");
    
  }
}




function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function (e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
      $('#spinner').show();
    };

    reader.readAsDataURL(input.files[0]);

    init().then(() => {
      predict().then(() => {
        jQuery(document).ready(function () {
          jQuery('.skillbar').each(function () {
            jQuery(this).find('.skillbar-bar').animate({
              width: jQuery(this).attr('data-percent')
            }, 3000);
          });
        });
        if ($('#restart-button').css("display") == "none") {
          $('#restart-button').css("display", "block");
          $('.notice-message').hide();
        }
      });
    });

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
  $("#percent-area").empty();
  $("#restart-button").hide();
  $('#result-area').empty();
  $('.notice-message').show();
  $('#spinner').hide();
  $("#percent-text").empty();
  $("#percent-notice").empty();
}
$('.image-upload-wrap').bind('dragover', function () {
  $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
  $('.image-upload-wrap').removeClass('image-dropping');
});

function classChange(meatName) {
  switch (meatName) {
    case "sodeungsim":
      resultMessage = "소 등심";

      break;
    case "sobuchesal":
      resultMessage = "소 부채살";

      break;
    case "chadolbaki":
      resultMessage = "차돌박이";

      break;
    case "soapdari":
      resultMessage = "소 앞다리";

      break;
    case "apdarisal":
      resultMessage = "돼지 앞다리살";

      break;
    case "nocksal":
      resultMessage = "돼지 목살";

      break;
    case "sosate":
      resultMessage = "소 사태/아롱사태";

      break;
    case "somoksim":
      resultMessage = "소 목심";

      break;
    case "galmegisal":
      resultMessage = "갈매기살";

      break;
    case "hongdukkesal":
      resultMessage = "홍두깨살";

      break;
    case "deungsim":
      resultMessage = "돼지 등심";

      break;
    case "chekkeutsal":
      resultMessage = "채끝살";

      break;
    case "gabrisal":
      resultMessage = "가브리살";

      break;
    case "hangeongsal":
      resultMessage = "항정살";

      break;
    case "samgyeapsal":
      resultMessage = "삼겹살";

      break;
    case "galbisal":
      resultMessage = "돼지 갈비살";

      break;
    case "ansim":
      resultMessage = "돼지 안심";

      break;
    case "doganisal":
      resultMessage = "도가니살";

      break;
    case "ditdarisal":
      resultMessage = "돼지 뒷다리살";

      break;
    case "sogalbisal":
      resultMessage = "소 갈비살";

      break;
    case "soansim":
      resultMessage = "소 안심";

      break;
    case "sofoot":
      resultMessage = "우족";

      break;
    case "foot":
      resultMessage = "돈족";

      break;
    default:
      resultMessage = "알 수 없음";
  }
  return resultMessage;
}

function resultText(percent) {
  if(percent < 50){
    return "인가..?";
  } 
  else if (percent < 80){
    return "처럼 보입니다.";
  } 
  else {
    return "입니다!";
  }
}

