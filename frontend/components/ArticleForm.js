import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { setCurrentArticleId, postArticle, updateArticle, currentArticle } = props

  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if (currentArticle) setValues(currentArticle)
    else setValues(initialFormValues)
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const cancelEdit = () => {
    setCurrentArticleId()
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    console.log('onSubmit ran')
    console.log(values)
    // We must submit a new post or update an existing one,
    // these arguments are incorrect but im not sure what else it could be
    const article_id = values.article_id
    const article = { title: values.title, text: values.text, topic: values.topic }
    if (currentArticle) updateArticle({ article_id, article })
    else {postArticle(values)}
    setCurrentArticleId()
    setValues(initialFormValues)
    // depending on the truthyness of the `currentArticle` prop.
  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    if (values.title !== '' && values.text !== '' && values.topic !== '') return false
    else return true
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    // onSubmit={onSubmit} use to go on the line below
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {/* function.prototype needs to be changed with something but im not sure what yet */}
        {currentArticle && <button onClick={() => cancelEdit()}>Cancel edit</button>}
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
