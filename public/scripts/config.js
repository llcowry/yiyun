var HOST = window.location.host;
var PREFIX_HOST = "http://" + HOST + "/";
var PREFIX_FILE_HOST = "http://" + HOST + "/";
var PREFIX_URL = "http://" + HOST + "/";
var PREFIX_S1_URL = "http://" + HOST + "/";
var redirect_uri = encodeURIComponent("http://" + HOST + "/passport.html");
var challenge, validate, seccode, selectorA;
var submit = false;
var icpNumber = '湘ICP备13012373号-6';

function gt_custom_ajax(result, selector) {
  selectorA = selector;
  if (result) {
    challenge = selector(".geetest_challenge").value;
    validate = selector(".geetest_validate").value;
    seccode = selector(".geetest_seccode").value;
    submit = true;
  }
}