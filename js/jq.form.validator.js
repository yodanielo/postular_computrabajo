$.fn.formValidator = function(df) {
    settings = {
        validators: {
            "required": "required", //obligatorio
            "email": "email" //email
        },
        chars: {
            "alpha": "alpha", //letras normlaes
            "uppercase": "mayusculas", //letras normlaes
            "lowercase": "minusculas", //letras normlaes
            "special": "especial", //caracteres especiales
            //"numero"       :"number",//numeros
            "decimal": "decimal", //decimales
            "entero": "integer", //entero
            "thousand": "thousand" //miles
        },
        msg: {
            "msgrequired": "{campo} field is mandatory",
            "msginvalid": "{campo} field is invalid"
        },
        settings: {
            "eol": "<br/>", //eol de linea
            "sepdecimal": ".",
            "sepmiles": "'",
            "fieldname": "alt"
        },
        events: {
            "onValidated": function() {
            }
        }
    };
    df = jQuery.extend(settings, df);
    /***************************************************************************
     preparación de variables ************************************************** 
     ***************************************************************************/
    formulario = this;
    clases_originales = new Object();
    //selector de inputs
    charselector = "";
    $.each(df.validators, function(k, v) {
        df.validators[k] = ":input." + v;
    });
    $.each(df.chars, function(k, v) {
        clases_originales[k] = v;
        df.chars[k] = ":input." + v;
        charselector += "," + df.validators[k];
    });
    if (charselector.length > 0)
        charselector = charselector.substr(1, charselector.length);

    var chars = new Object();
    chars.alpha = [];
    chars.special = [];
    chars.uppercase = [];
    chars.lowercase = [];
    chars.decimal = [];
    chars.entero = [];
    chars.thousand = [];
    for (i = 0; i < 255; i++) {
        if ((i >= 65 && i <= 90) || (i >= 97 && i <= 122) || (i >= 128 && i <= 157) || (i >= 160 && i <= 165) || (i >= 181 && i <= 183) || (i >= 198 && i <= 199) || (i >= 209 && i <= 216) || (i >= 224 && i <= 237))
            chars.alpha.push(i);
        if ((i >= 65 && i <= 90) || i === 128 || (i >= 142 && i <= 144) || i === 146 || (i >= 153 && i <= 154) || (i >= 156 && i <= 157) || i === 165 || (i >= 181 && i <= 183) || i === 199 || (i >= 209 && i <= 212) || (i >= 214 && i <= 216) || (i >= 224 && i <= 227) || i === 229 || (i >= 233 && i <= 235) || i === 237)
            chars.uppercase.push(i);
        if ((i >= 97 && i <= 122) || (i >= 129 && i <= 141) || i === 145 || (i >= 147 && i <= 152) || i === 155 || (i >= 160 && i <= 164) || i === 198 || i === 228 || (i >= 230 && i <= 232) || i === 236)
            chars.lowercase.push(i);
        if ((i >= 0 && i <= 47) || (i >= 58 && i <= 64) || (i >= 91 && i <= 96) || (i >= 123 && i <= 126) || (i >= 158 && i <= 159) || (i >= 166 && i <= 180) || (i >= 184 && i <= 197) || (i >= 200 && i <= 208) || (i >= 217 && i <= 223) || (i >= 155 && i <= 159) || (i >= 238 && i <= 255))
            chars.special.push(i);
        if ((i >= 48 && i <= 57) || i === String.fromCharCode(df.settings.sepdecimal))
            chars.decimal.push(i);
        if ((i >= 48 && i <= 57))
            chars.entero.push(i);
        if (i === String.fromCharCode(df.settings.sepmiles))
            chars.thousand.push(i);
    }

    //$(formulario).on("change",".required, .email, .alpha, .mayusculas, .minusculas, .especial, .decimal, .integer, .thousand",function(){
    valorneto = function(valor) {
        return valor.split(" ").join("").split("\n").join("");
    };

    validaEmail = function(ctr) {
        var valor = "";
        if (ctr === null)
            return true;
        else {
            if (typeof (ctr) === "object")
                valor = $(ctr).val();
            else
                valor = ctr;
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(valor);
    };

    validaNumero = function(ctr, esentero, miles) {
        var valor = "";
        if (ctr === null)
            return true;
        else {
            if (typeof (ctr) === "object")
                valor = $(ctr).val();
            else
                valor = ctr;
        }
        var re = new Object();
        if (esentero) {
            re = /^\d+$/;
            if (miles) {
                re = new RegExp("/^(\\d{0,3})(" + df.settings.sepmiles + "\\d{3})*$/");
            }
        }
        else {
            re = /^\d+\.\d{0,}$/;
            if (miles) {
                re = new RegExp("/^(\\d{0,3})(" + df.settings.sepmiles + "\\d{3})*(\\" + df.settings.sepdecimal + "\\d{1,})?$/");
            }
        }
        return re.test(valor);
    };

    $(formulario).submit(function() {
        var validado = true;
        var errores = [];
        $(formulario).find(df.validators.required).each(function() {
            var ctrl_v = this;
            if (valorneto($(ctrl_v).val()) === "") {
                validado = false;
                errores.push({
                    "objeto": $(this).attr("id"),
                    "mensaje": df.msg.msgrequired.split("{campo}").join(jQuery(ctrl_v).attr(df.settings.fieldname))
                });
            }
        });

        /*****************************************************************
         Correo electrónico **********************************************
         *****************************************************************/
        $(formulario).find(df.validators.email).each(function() {
            if (valorneto($(this).val()) !== "" && !validaEmail(this)) {
                errores.push({
                    "objeto": $(this).attr("id"),
                    "mensaje": df.msg.msginvalid.split("{campo}").join($(this).attr(df.settings.fieldname))
                });
                validado = false;
            }
        });

        /*****************************************************************
         validación de caractéres*****************************************
         *****************************************************************/

        //selecciono todos los input que necestan validar caracteres
        $(formulario).find(charselector).each(function() {
            ctrl_v = this;
            //el vector de caracteres válidos
            vector_char = [];
            $.each(clases_originales, function(k, v) {
                if ($(ctrl_v).hasClass(v))
                    vector_char = vector_char.concat(chars[k]);
            });
            //valido caracteres
            var pasaChar = true;
            $.each($(ctrl_v).val(), function(k, v) {
                //por cada caracter veo si está en la lista de admitidos
                if (vector_char.indexOf(v) === -1)
                    pasaChar = false;
            });
            if (!pasaChar) {
                errores.push({
                    "objeto": $(ctrl_v).attr("id"),
                    "mensaje": df.msg.msginvalid.split("{campo}").join($(ctrl_v).attr(df.settings.fieldname))
                });
                validado = false;
            }
        });

        //valido numeros
        jQuery(formulario).find(df.chars.decimal).each(function() {
            var ctrl_v = this;
            var miles = $(this).hasClass(clases_originales.thousand);
            if (valorneto(this) !== "" && !validaNumero(this, false, miles)) {
                validado = false;
                errores.push({
                    "objeto": $(ctrl_v).attr("id"),
                    "mensaje": df.msg.msginvalid.split("{campo}").join(jQuery(ctrl_v).attr(df.settings.fieldname))
                });
            }

        });
        jQuery(formulario).find(df.chars.entero).each(function() {
            var ctrl_v = this;
            var miles = $(this).hasClass(clases_originales.thousand);
            if (valorneto(this) !== "" && !validaNumero(this, false, miles)) {
                validado = false;
                errores.push({
                    "objeto": $(ctrl_v).attr("id"),
                    "mensaje": df.msg.msginvalid.split("{campo}").join(jQuery(ctrl_v).attr(df.settings.fieldname))
                });
            }

        });
        if (!validado)
        {
            df.events.onValidated(validado, errores);
            return false;
        }
        else {
            return df.events.onValidated(validado, errores);
        }
        //$(formulario).find(df.validators)
    });

};