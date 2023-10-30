import app from './app'
const PORT = 3000;
const server = app.listen(PORT, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`),
)

export default server