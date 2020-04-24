$(document).ready(function(){    
    $('.nav_btn').on('click',function(e){
        e.preventDefault();
        $('.nav').toggle();
        $('.nav_btn').toggleClass("active");
    });        

    $('.question').on('click',function(e){
        e.preventDefault();
        $('.banner').css('transform','translateY(0)');
    });
    $('.banner,.imgClose').on('click',function(e){
        e.preventDefault();
        $('.banner').css('transform','translateY(-1500px)');
    });
    $('.top a').click(function(e){
        e.preventDefault();
        $('.maskData').animate({
            scrollTop:0
        }, 1000);
    });
    $('.maskData').scroll(function(){
        var topscroll=$(this).scrollTop();
        console.log(topscroll);
        if(topscroll > 50){
            $('.top').slideDown(1000); 
                    
        }else{
            $('.top').slideUp(500);        
        };
    })
});
