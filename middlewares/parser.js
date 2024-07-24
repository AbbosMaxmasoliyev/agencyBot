const parser = async (req, res, next) => {
    let body = '';

    await req.on('data', chunk => {
        body += chunk.toString();
    });

    await req.on('end', () => {
        req.body = JSON.parse(body);

        next();

    });
    next()
};


module.exports = { parser }