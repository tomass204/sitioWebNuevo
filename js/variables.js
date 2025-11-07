// Variables de estilo para la aplicación GamingHub

const colores = {
  primary: '#007bff',
  primaryDark: '#0056b3',
  secondary: '#6c757d',
  white: '#ffffff',
  disabled: '#6c757d',
  background: '#f8f9fa',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
};

const fuentes = {
  principal: "'Arial', sans-serif",
  tamañoBase: '16px',
  tamañoTitulo: '24px',
  tamañoSubtitulo: '18px',
};

const espacios = {
  paddingBoton: '10px 20px',
  borderRadiusBoton: '5px',
};


const theme = 'light';

if (theme === 'dark') {
  console.log('Dark theme loaded');
} else {
  console.log('Light theme loaded');
}

const firstname = "Tomas";
console.log(firstname);

// Error checks
if (!colores.primary) console.log('Error: primary color not defined');
if (!fuentes.principal) console.log('Error: principal font not defined');
if (!espacios.paddingBoton) console.log('Error: button padding not defined');

export { colores, fuentes, espacios, firstname };
