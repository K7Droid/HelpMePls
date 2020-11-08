const lambda_base_url = 'https://5kqbiloijh.execute-api.us-east-1.amazonaws.com/uAttendance'

/* this will be replace by the url for the elastic load balancing*/
const ec2_base_url = 'http://54.87.215.134:3000/uattendance'
//const ec2_base_url = 'http://localhost:3000/uattendance'

/*******************************************************************************************************************************/
/** Server - EC2 **/
const loginUsuario = () => {
    //Login usuario tipo profesor
    console.log('Login de usuario profesor')
    const file = $('#loginimage')[0].files[0];
    if( $('#loginimage')[0].files.length == 0){
        $.ajax({
            type: 'POST',
            url: ec2_base_url + '/login',
            crossDomain: true,
            data: JSON.stringify({
                tipo: 0, // 0 user y pass // 1 con foto
                id: 'cristiancaste18', //input
                password: '123', 
            }),
            contentType: 'application/json',
            dataType: 'json',
        }).done((data)=>{
            console.log('Done!',data)
        }).fail(error => {
            console.log('Error',error)
        })

    } else {
        const reader = new FileReader()
        let response;
        reader.readAsDataURL(file)
        reader.onload = () => {
            response = reader.result
            //Registra usuario tipo profesor para que acceda al sistema
            $.ajax({
                type: 'POST',
                url: ec2_base_url + '/login',
                crossDomain: true,
                data: JSON.stringify({ 
                    tipo: 1,
                    id: null, //--------> ASIGNAR EL VALOR DEL USERNAME
                    password: null, //----> ASIGNAR EL VALOR DE LA CONTRASE;A UNA VEZ VERIFICADA QUE SE REPITIO CORRECTAMENTE
                    foto: response, // Foto OPCIONAL
                    extension: file.name.split('.')[1]
                }),
                contentType: 'application/json',
                dataType: 'json',
            }).done((data)=>{
                console.log('Done!',data)
            }).fail(error => {
                console.log('Error',error)
            })
        }
        reader.onerror = function (error) {
            response =  null
        };
    }
}


const registrarUsuario = () => {
    console.log('Registrar un usuario profesor')
    const file = $('#registerimage')[0].files[0];
    if( $('#registerimage')[0].files.length == 0){
        $.ajax({
            type: 'POST',
            url: ec2_base_url + '/register',
            crossDomain: true,
            data: JSON.stringify({ 
                id: 'newUserName',  //--------> ASIGNAR EL VALOR DEL USERNAME
                password: 'newPass', //----> ASIGNAR EL VALOR DE LA CONTRASE;A UNA VEZ VERIFICADA QUE SE REPITIO CORRECTAMENTE
                foto: null, // Foto OPCIONAL
                extension: null, 
            }),
            contentType: 'application/json',
            dataType: 'json',
        }).done((data)=>{
            console.log('Done!',data)
        }).fail(error => {
            console.log('Error',error)
        })
        return
    }
    const reader = new FileReader()
    let response;
    reader.readAsDataURL(file)
    reader.onload = () => {
        response = reader.result
        //Registra usuario tipo profesor para que acceda al sistema
        $.ajax({
            type: 'POST',
            url: ec2_base_url + '/register',
            crossDomain: true,
            data: JSON.stringify({ 
                id: 'keanu', //--------> ASIGNAR EL VALOR DEL USERNAME data-imasf/,sdsdsdsd
                password: 'john', //----> ASIGNAR EL VALOR DE LA CONTRASE;A UNA VEZ VERIFICADA QUE SE REPITIO CORRECTAMENTE
                foto: response, // Foto OPCIONAL
                extension: file.name.split('.')[1]
            }),
            contentType: 'application/json',
            dataType: 'json',
        }).done((data)=>{
            console.log('Done!',data)
        }).fail(error => {
            console.log('Error',error)
        })
    }
    reader.onerror = function (error) {
        response =  null
    };
}

const registrarEstudiante = () => {
    console.log('Registrar usuario estudiante')

    const file = $('#studentimage')[0].files[0];
    if( $('#studentimage')[0].files.length == 0){
        return
    }
    const reader = new FileReader()
    let response;
    reader.readAsDataURL(file)
    reader.onload = () => {
        response = reader.result
        //Registra usuario tipo profesor para que acceda al sistema
        $.ajax({
            type: 'POST',
            url: ec2_base_url + '/student',
            crossDomain: true,
            data: JSON.stringify({ 
                id: 'newUserName', // -----------> ASIGNAR EL VALOR INGRESADO
                foto: response, 
                extension: file.name.split('.')[1]
            }),
            contentType: 'application/json',
            dataType: 'json',
        }).done((data)=>{
            console.log('Done!',data)
        }).fail(error => {
            console.log('Error',error)
        })
    }
    reader.onerror = function (error) {
        response =  null
    };
}

const getEstudiantes = () => {
    console.log('obtenerEstudiantes')
    $.ajax({
        type: 'GET',
        url: ec2_base_url + '/student',
        crossDomain: true,
        data: JSON.stringify({
            payload: 'Hello world!'
        }),
        contentType: 'application/json',
        dataType: 'json',
    }).done((data) => {
        console.log('Done!', data)
    }).fail(error => {
        console.log('Error',error)
    })
}
/*******************************************************************************************************************************/
/** Serverless - Lambda **/
const registrarFotoGrupal = () => {
    console.log('Registrar foto grupal')
    $.ajax({
        type: 'POST',
        url: lambda_base_url+'/fotogrupal',
        crossDomain: true,
        data: JSON.stringify({ 
            id: '0546546-2020-09-13', 
            foto: 'example:data:base-64;asdjkkAJJSSAaksdksdkslkalkalslkdlklksad' //Foto OBLIGATORIA
        }),
        contentType: 'application/json',
        dataType: 'json'
    }).done((data)=>{
        console.log('Done!',data)
    }).fail(error => {
        console.log('Error',error)
    })
}

const getFotosGrupales = () => {
    console.log('Obtener fotos grupales')
    $.ajax({
        type: 'GET',
        url: lambda_base_url+'/fotogrupal',
        crossDomain: true,
        data: {
            payload: 'Hello world!'
        },
        contentType: 'application/json',
        dataType: 'json'
    }).done((data) => {
        console.log('Done!', data)
        console.log(data['body'])
    }).fail(error => {
        console.log('Error',error)
    })
}

const getAsistencias = () => {
    console.log('Obtener asistencias')
    $.ajax({
        type: 'GET',
        url: lambda_base_url + '/asistencias',
        data: {
            payload: 'Hello world!'
        },
        dataType: 'json',
    }).done((data) => {
        console.log('Done!', data)
    }).fail(error => {
        console.log('Error',error)
    })
}