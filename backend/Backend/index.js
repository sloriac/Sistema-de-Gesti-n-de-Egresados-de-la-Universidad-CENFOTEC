//Dependencias, son bibliotecas que se instalan para que el servidor pueda levantarse correctamente
const express = require('express'); //Facilita la creación de servidores y manejo de rutas
const mongoose = require('mongoose'); //Permite conectarse a la BD de mongoDB y crear las colecciones y realizar consultas
const cors = require('cors'); //Permite la comunicación entre dominios diferentes
const bodyParser = require('body-parser'); //Permite interpretar los datos que vienen en la petición en formto json
require('dotenv').config(); //Se importa el archivo .env para poder utilizar sus variables dentro del código

const app = express(); //Crear una instancia de express
const PORT = process.env.PORT || 3000; //Usar el puerto indicado en .env o si no se indica usar el puerto 3000

// Importación de rutas
const usuarioRoutes = require('./routes/usuario.routes');
const egresadoRoutes = require('./routes/egresado.routes');
const carreraRoutes = require('./routes/carrera.routes');
const escuelaRoutes = require('./routes/escuela.routes');
const tituloRoutes = require('./routes/titulo.routes');
const mentorRoutes = require('./routes/mentor.routes');
const oportunidadMentoriaRoutes = require('./routes/oportunidadMentoria.routes');
const solicitudMentoriaRoutes = require('./routes/solicitudMentoria.routes');
const mentoriaRoutes = require('./routes/mentoria.routes');
const oportunidadLaboralRoutes = require('./routes/oportunidadLaboral.routes');

app.use(express.json());//Habilita el manejo de JSON en las peticiones
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());//Habilita el análisis de JSON en las peticiones 
app.use(cors());

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); // Para el error querySrv ECONNREFUSED  https://alexbevi.com/blog/2023/11/13/querysrv-errors-when-connecting-to-mongodb-atlas/
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('MongoDB Atlas conectado'))
.catch(error => console.log('Ocurrió un error al conectarse con MongoDB: ', error));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/egresados', egresadoRoutes);
app.use('/carreras', carreraRoutes);
app.use('/escuelas', escuelaRoutes);
app.use('/titulos', tituloRoutes);
app.use('/mentores', mentorRoutes);
app.use('/oportunidades-mentoria', oportunidadMentoriaRoutes);
app.use('/solicitudes-mentoria', solicitudMentoriaRoutes);
app.use('/mentorias', mentoriaRoutes);
app.use('/oportunidades-laborales', oportunidadLaboralRoutes);

app.get('/', (req,res)=> {
    res.send('Servidor en funcionamiento');
});

app.listen(PORT, ()=>{
    console.log('Servidor corriendo en http://localhost:' + PORT);
});