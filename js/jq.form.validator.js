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
            "msgformat": "{campo} field has wrong format",
            "msginvalidchars": "{campo} hasn't admited characters"
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
    df.validators = $.extend({}, settings.validators, df.validators);
    df.chars = $.extend({}, settings.chars, df.chars);
    df.msg = $.extend({}, settings.msg, df.msg);
    df.settings = $.extend({}, settings.settings, df.settings);
    df.events = $.extend({}, settings.events, df.events);
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
        if ((i >= 48 && i <= 57) || i === df.settings.sepdecimal.charCodeAt(0))
            chars.decimal.push(i);
        if ((i >= 48 && i <= 57))
            chars.entero.push(i);
        if (i === df.settings.sepmiles.charCodeAt(0))
            chars.thousand.push(i);
    }

    $.each(df.chars, function(k, v) {
        clases_originales[k] = v;
        df.chars[k] = ":input." + v;
        charselector += ",." + v;
    });
    if (charselector.length > 0)
        charselector = charselector.substr(1, charselector.length);

    getSelectionStart = function(o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', o.value.length);
            if (r.text === '') {
                return o.value.length;
            }
            return o.value.lastIndexOf(r.text);
        } else {
            return o.selectionStart;
        }
    };

    // Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
    getSelectionEnd = function(o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveStart('character', -o.value.length);
            return r.text.length;
        } else
            return o.selectionEnd;
    };

    // set the selection, o is the object (input), p is the position ([start, end] or just start)
    setSelection = function(o, p) {
        // if p is number, start and end are the same
        if (typeof p === "number") {
            p = [p, p];
        }
        ;
        // only set if p is an array of length 2
        if (p && p.constructor === Array && p.length === 2) {
            if (o.createTextRange) {
                var r = o.createTextRange();
                r.collapse(true);
                r.moveStart('character', p[0]);
                r.moveEnd('character', p[1]);
                r.select();
            }
            else if (o.setSelectionRange) {
                o.focus();
                o.setSelectionRange(p[0], p[1]);
            }
        }
    };

    //$(formulario).on("change",".required, .email, .alpha, .mayusculas, .minusculas, .especial, .decimal, .integer, .thousand",function(){
    valorneto = function(ctr) {
        var valor = "";
        if (ctr === null)
            return true;
        else {
            if (typeof (ctr) === "object")
                valor = $(ctr).val();
            else
                valor = ctr;
        }
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
                re = new RegExp("^(\\d{1,3})(" + df.settings.sepmiles + "\\d{3})*$");
            }
        }
        else {
            re = new RegExp("^\\d+(\\" + df.settings.sepdecimal + "\\d{1,})?$");
            if (miles) {
                re = new RegExp("^(\\d{0,3})(" + df.settings.sepmiles + "\\d{3})*(\\" + df.settings.sepdecimal + "\\d{1,})?$");
            }
        }
        return re.test(valor);
    };

    validacaracteres = function(ctrl_v, elimina_chars) {
        if (elimina_chars === null)
            elimina_chars = false;
        var carat = getSelectionStart(this);
        var selectionEnd = getSelectionEnd(this);
        //ctrl_v = this;
        errores = [];
        //el vector de caracteres válidos
        vector_char = [];
        $.each(clases_originales, function(k, v) {
            if ($(ctrl_v).hasClass(v))
                vector_char = vector_char.concat(chars[k]);
        });
        //valido caracteres
        var pasaChar = true;
        var txtOriginal = $(ctrl_v).val();
        $.each($(ctrl_v).val().split(""), function(k, v) {
            //por cada caracter veo si está en la lista de admitidos
            if (vector_char.indexOf(v.toString().charCodeAt(0)) === -1) {
                pasaChar = false;
                if (elimina_char) {
                    txtOriginal = txtOriginal.substring(0, k) + txtOriginal.substring(k + 1);
                }
            }
        });
        $(ctrl_v).val(txtOriginal);
        setSelection(this, [carat, selectionEnd]);

        if (!pasaChar) {
            errores.push({
                "objeto": $(ctrl_v).attr("id"),
                "mensaje": df.msg.msginvalidchars.split("{campo}").join($(ctrl_v).attr(df.settings.fieldname))
            });
            validado = false;
        }
        return errores;
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
                    "mensaje": df.msg.msgformat.split("{campo}").join($(this).attr(df.settings.fieldname))
                });
                validado = false;
            }
        });

        /*****************************************************************
         validación de caractéres*****************************************
         *****************************************************************/

        //selecciono todos los input que necestan validar caracteres
        $(formulario).find(charselector).each(function() {
            aux_errores = validacaracteres(this);
            if (aux_errores.length > 0) {
                errores.concat(aux_errores);
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
                    "mensaje": df.msg.msgformat.split("{campo}").join(jQuery(ctrl_v).attr(df.settings.fieldname))
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
                    "mensaje": df.msg.msgformat.split("{campo}").join(jQuery(ctrl_v).attr(df.settings.fieldname))
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
    $(formulario).on("keyup", charselector, function(event) {
        aux_errores = validacaracteres(this);
        if (aux_errores.length > 0) {
            event.preventDefault();
        }
    });
    $(formulario).on("change", charselector, function(event) {
        aux_errores = validacaracteres(this, true);
        if (aux_errores.length > 0) {
            errores.concat(aux_errores);
            validado = false;
        }
    });
};