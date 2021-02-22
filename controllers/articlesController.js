const router = require('express').Router()
const db = require('../models')

router.get('/:id', async (req, res) => {
    try {
      const article = await db.article.findOne({
        where: { id: req.params.id },
        include: [db.author, db.comment]
      })
      res.json({ article: article })
    } catch(error) {
      console.log(error)
      res.status(400).json({ message: 'bad request' })
    }
  })
  
  router.post("/:id/comments", async (req, res) => {
    try {
      const article = await db.article.findByPk(req.params.id, {includes:db.comment})
      if(!article) throw new Error("article not found")
      const comment = await db.comment.create({
        name: req.body.name,
        content: req.body.content
      })
      await article.addComment(comment)
      res.redirect(`/articles/${req.params.id}`)
    } catch (err) {
      console.log(err)
    }
  })

module.exports = router