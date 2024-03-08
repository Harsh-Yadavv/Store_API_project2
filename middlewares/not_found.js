const notFound = (req, res) => {
    res.status(404).send('Oops! Route does not exist')
}

module.exports = notFound