$(function() {
    $(".hmoption .btn").click(function() {
        $(".hmoption .btn").removeClass("active");
        $(this).addClass("active");
    });
    $("#formulario_registro form").formValidator({
        settings:{
            fieldname:"placeholder"
        },
        events:{
            onValidated:function(rpt,errors){
                if(rpt){
                    alert("Success");
                    return false;
                }
                else{
                    msg="";
                    $.each(errors,function(k,v){
                        msg+=v.mensaje+"\n";
                    });
                    alert(msg);
                }
            }
        }
    });
});