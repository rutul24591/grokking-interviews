// Strangler pattern route
app.use('/legacy', legacyApp);
app.use('/new', newServiceProxy);
