$(window).on('load', function () {
    // 遮罩层 三秒后消失
    // $('.ze_zao').delay(3000).fadeOut(100);
    $('.ze_zao').fadeOut(100);
});
$(function () {
    let URL = 'http://localhost:8080/';
    /*导航栏区域*/
    $('.header_right_bottom_li').hover(function () {
        $(this).children('ul').stop().slideToggle(500);
    });
    $('.header_box').click(function () {
        $('.header_right').stop().fadeToggle(500);
    });
    /*轮播图*/
    let index = 1;
    let img_lenth = null;
    let banner_ul = $('.banner_one>ul');
    let banner_three = $('.banner_three>button');
    let banner_two = $('.banner_two>img');
    $.get(URL + '/json/iaa/banner', function (date) {
        $.each(date, function (index, ele) {
            banner_ul.append('<li>\n' +
                '                <img src="image/' + ele.url + '" alt=' + ele.alt + ' title=' + ele.name + ' onerror="src=\'image/1.jpg\'">\n' +
                '            </li>')
        });
        img_lenth = $('.banner_one').find('img');
    });

    function banner() {
        let imagesW = img_lenth.outerWidth();
        if (index == -1) {
            index = img_lenth.length - 1;
        } else if (index == img_lenth.length) {
            index = 0;
        }
        banner_ul.stop().animate({
            left: -index * imagesW,
        }, 100)
       banner_two.removeClass('banner_xz');
       banner_two.eq(index++).addClass('banner_xz');
    };
    var timeOne=setInterval(function () {
        banner();
    }, 3000)
    banner_three.eq(0).click(function () {
        index -= 2;
        banner();
    });
    banner_three.eq(1).click(function () {
        banner();
    });
   banner_two.click(function () {
      index = $(this).index();
      banner();
   });
    /*倒计时模块*/
    let time = null;
    let xianshiTime = $('.djs>h1');
    $.get(URL + '/json/iaa/countdown', function (date) {
        time = date[0].tarrget;
    });

    function Countdown() {
        let inputTime = +new Date(time);
        let nowTime = +new Date();
        let s = (inputTime - nowTime) / 1000;
        let day = parseInt(s / 60 / 60 / 24);
        let hour = parseInt(s / 60 / 60 % 24);
        let miute = parseInt(s / 60 % 60);
        let second = parseInt(s % 60);
        day = day < 10 ? '0' + day : day;
        hour = hour < 10 ? '0' + hour : hour;
        miute = miute < 10 ? '0' + miute : miute;
        second = second < 10 ? '0' + second : second;
        return '距离活动开始还剩下：'+day+'天'+hour+'时'+miute+'分'+second+'秒';
    }
    var timeTwo =setInterval(function () {
       xianshiTime.html(Countdown);
    },1000);
    /*新闻部分！*/
    $.get(URL+'/json/iaa/news',function (date) {
        $.each(date,function (index,ele) {
            let dateS = new Date(ele.date);
            let showDate = dateS.getFullYear() +'年'+dateS.getMonth()+'月'+dateS.getDate()+'日';
            $('.news_ul').append(' <li>\n' +
                '                <img src="image/'+ele.image+'" alt="网络加载失败" title="新闻的图片" onerror="src=\'image/1.jpg\'">\n' +
                '                <h2>'+ele.title+'</h2>\n' +
                '                <p class="news_ul_li_p">\n' +
                '                    <span>'+showDate+'</span>\n' +
                '                    <span>'+ele.description+'</span>\n' +
                '                </p>\n' +
                '            </li>')
        })
    });
   /*表单提交部分*/
   let tel_zz =/^1[3456789]\d{9}$/;
   let eml_zz = /^\w+@[a-zA-Z0-9]+\.[a-z]{2,4}$/;
    let error =$('.error');
    let formChildren = $('.form_three').children();

    let formTel = formChildren.eq(1);
    $('.submit_form').click(function () {
       let formChildrenTwo = $('.form_four').children();
       let form_form = $('.form_form');
       let form_Name = formChildren.eq(0);
       let form_Date = formChildren.eq(2);
       let formNuber = formChildrenTwo.eq(0).val();
       let telZz = tel_zz.test(formTel.val());
       let eleZz = eml_zz.test(formTel.val());
       if ((telZz || eleZz ) && (formNuber>0 && formNuber<6)){
           $.post(URL+'/json/iaa/tickets',{
               name:form_Name.val(),
               visiting_date:form_Date.val(),
               contact_information:formTel.val(),
               attendees_number:parseInt(formNuber),
           },function (date) {
               alert(date);
               // 刷新界面
               location.reload();
           });
       }else {
           error.html('您输入的邮箱或手机有误！！').css('color','red');
           form_form.submit(function () {
               return false
           })
       }
   });
    formTel.focus(function () {
        error.html('');
    })
});