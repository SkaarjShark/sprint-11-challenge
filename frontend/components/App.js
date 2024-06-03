import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem('token')) localStorage.removeItem('token')
    navigate('/')
    setMessage('Goodbye!')
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage(''), setSpinnerOn(true)
    // and launch a request to the proper endpoint.
    axios.post('http://localhost:9000/api/login', {username, password})
    .then(res => {
      console.log(res)
      setMessage(res.data.message)
      localStorage.setItem('token', res.data.token)
      navigate('/articles')
    })
    .catch(err => console.error(err))
    .finally(() => {setSpinnerOn(false)})
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage(''), setSpinnerOn(true)
    axios.get('http://localhost:9000/api/articles', {headers: {Authorization: localStorage.getItem('token')}})
      .then(res => {
        console.log(res)
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.error(err)
        if (err.response.status === 401) navigate('/')
      })
      .finally(() => {setSpinnerOn(false)})
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    console.log('postArticle ran')
    console.log(article)
    setMessage(''), setSpinnerOn(true)
    axios.post('http://localhost:9000/api/articles', article, {headers: {Authorization: localStorage.getItem('token')}})
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        const article = res.data.article
        const article_id = res.data.article.article_id
        setArticles([...articles, article])
        // working good, but it needs to update and clear the article form by itself without needing to refresh the page.
      })
      .catch(err => {console.error(err), setMessage(err.message)})
      .finally(() => {setSpinnerOn(false)})
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    console.log('updateArticle ran')
    console.log(article_id)
    console.log(article)
    setMessage(''), setSpinnerOn(true)
    axios.put(`http://localhost:9000/api/articles/${article_id}`, article, {headers: {Authorization: localStorage.getItem('token')}})
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        const newArticles = articles.map(art => {
          if (art.article_id === article_id) {
            return {...article, article_id}
          }
          return art
        })
        setArticles(newArticles)
      })
      .catch(err => {console.error(err), setMessage(err.message)})
      .finally(() => {setSpinnerOn(false)})
  }

  const deleteArticle = article_id => {
    // ✨ implement
    console.log('deleteArticle ran')
    console.log(article_id)
    setMessage(''), setSpinnerOn(true)
    axios.delete(`http://localhost:9000/api/articles/${article_id}`, {headers: {Authorization: localStorage.getItem('token')}})
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        const newArticles = articles.filter(art => {
          if (art.article_id !== article_id) return art
        })
        setArticles(newArticles)
      })
      .catch(err => {console.error(err), setMessage(err.message)})
      .finally(() => {setSpinnerOn(false)})
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                setCurrentArticleId={setCurrentArticleId} 
                postArticle={postArticle} 
                updateArticle={updateArticle}
                currentArticle={articles.find(articles => articles.article_id == currentArticleId)} 
              />
              <Articles 
                articles={articles} 
                getArticles={getArticles}
                currentArticleId={currentArticleId} 
                setCurrentArticleId={setCurrentArticleId} 
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
