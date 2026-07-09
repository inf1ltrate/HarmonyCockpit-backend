const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}/login.html`);
    console.log(`Dashboard: http://localhost:${PORT}/`);
    console.log(`API Base: http://localhost:${PORT}/api`);
});