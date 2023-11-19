require("dotenv").config()
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const User = require("./models/User")
const compression = require("compression")
const helmet = require("helmet")

// Define and configure app

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(compression())
app.use(helmet())

// Setup rate limiter
const RateLimit = require("express-rate-limit")
const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 20 })
app.use(limiter)

// Setup express-session and passport

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username })
      if (!user) {
        return done(null, false, { message: "Invalid email" })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return done(null, false, { message: "Invalid password" })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Connect to database

const mongoDB = process.env.MONGODB_URI
const main = async () => mongoose.connect(mongoDB)
main().catch((err) => console.error(err))

// Set middleware to access user from locals

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// Handle routes

const indexRouter = require("./routes/index")
const authRouter = require("./routes/auth")
const postRouter = require("./routes/post")

app.use(indexRouter)
app.use(authRouter)
app.use("/posts", postRouter)

app.listen(3000)
