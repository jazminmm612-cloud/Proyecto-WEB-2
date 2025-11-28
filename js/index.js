/*(async () => { 
    const url = 'https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=40.730610&longitude=-73.935242&lang=EN&mode=jason';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ee35e6d244mshfa697c005a909ffp19edd6jsnb50d1224b706',
            'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
        }
    };

    try {
        const respuesta = await fetch(url, options);
        const resultado = await respuesta.text();
        console.log(resultado);
    } catch (error) {
        console.error(error);
    }
})(); */

const options = {
    method: 'GET',
    headers: {                  //cambiar esto
        "x-rapidapi-key": "ee35e6d244mshfa697c005a909ffp19edd6jsnb50d1224b706",
        "x-rapidapi-host": "open-weather13.p.rapidapi.com"
    }
}
            //respuesta en json
fetch('https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=40.730610&longitude=-73.935242&lang=EN&mode=jason', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

