import mongoose from 'mongoose'
import fs from 'fs'
import csv from 'csv-parser'
import dotenv from 'dotenv'
import { Publisher } from '../src/models/Publisher.js'
import { Platform } from '../src/models/Platform.js'
import { Game } from '../src/models/Game.js'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const CSV_FILE_PATH = './seed/data/vgsales.csv'

/**
 * Parses the CSV file and returns an array of raw game records.
 *
 * @returns {Promise<object[]>} - The array of raw game records from the CSV.
 */
const parseCSV = () => {
  return new Promise((resolve, reject) => {
    const records = []

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', (error) => reject(error))
  })
}

/**
 * Clears all existing data from the database.
 * Ensures that the seed script can run multiple time without duplicates.
 */
const clearDatabase = async () => {
  await Game.deleteMany({})
  await Publisher.deleteMany({})
  await Platform.deleteMany({})
  console.log('Cleared existing data from database')
}

/**
 * Collects and seeds publishers from the raw game records.
 *
 * @param {object[]} records - The raw game records from the CSV.
 * @returns {Promise<Map<string, string>>} - A map of publisher name to MongoDB ObjectId.
 */
const seedPublishers = async (records) => {
  const publisherMap = new Map()

  for (const record of records) {
    const publisherName = record.Publisher?.trim()
    if (!publisherName || publisherName === 'N/A') continue

    if (!publisherMap.has(publisherName)) {
      // Initializes publisher with default stats.
      publisherMap.set(publisherName, { totalGames: 0, totalGlobalSales: 0 })
    }

    const publisher = publisherMap.get(publisherName)
    // Collects total games and sales for each publisher.
    publisher.totalGames += 1
    publisher.totalGlobalSales += parseFloat(record.Global_Sales) || 0
  }

  const publisherIdMap = new Map()

  for (const [publisherName, data] of publisherMap) {
    const publisher = await Publisher.create({
      name: publisherName,
      totalGames: data.totalGames,
      totalGlobalSales: parseFloat(data.totalGlobalSales.toFixed(2))
    })
    publisherIdMap.set(publisherName, publisher._id)
  }

  console.log(`Seeded ${publisherIdMap.size} publishers`)
  return publisherIdMap
}

/**
 * Collects and seeds platforms from the raw game records.
 *
 * @param {object[]} records - The raw game records from the CSV.
 */
const seedPlatforms = async (records) => {
  const platformMap = new Map()

  for (const record of records) {
    const name = record.Platform?.trim()
    if (!name) continue

    if (!platformMap.has(name)) {
      // Initializes platform with empty stats.
      platformMap.set(name, { totalGames: 0, genres: new Set(), releaseYears: new Set() })
    }

    const platform = platformMap.get(name)
    platform.totalGames += 1

    // Collects unique genres for this platform.
    if (record.Genre?.trim()) {
      platform.genres.add(record.Genre.trim())
    }

    // Collects unique release years for this platform.
    const year = parseInt(record.Year)
    if (!isNaN(year)) {
      platform.releaseYears.add(year)
    }
  }

  for (const [name, data] of platformMap) {
    await Platform.create({
      name,
      totalGames: data.totalGames,
      genres: [...data.genres],
      releaseYears: [...data.releaseYears].sort()
    })
  }

  console.log(`Seeded ${platformMap.size} platforms`)
}

/**
 * Seeds games from the raw game records using the publisher ID map.
 *
 * @param {object[]} records - The raw game records from the CSV.
 * @param {Map<string, string>} publisherIdMap - The map of publisher name to MongoDB ObjectId.
 */
const seedGames = async (records, publisherIdMap) => {
  const games = []

  for (const record of records) {
    const publisherName = record.Publisher?.trim()
    // Looks up the publisher's MongoDB ID from the map.
    const publisherId = publisherIdMap.get(publisherName)

    if (!publisherId) continue

    const year = parseInt(record.Year)

    // Builds the game object and maps the CSV fields to the schema fields.
    games.push({
      name: record.Name?.trim(),
      platform: record.Platform?.trim(),
      year: isNaN(year) ? null : year,
      genre: record.Genre?.trim(),
      publisher: publisherId,
      naSales: parseFloat(record.NA_Sales) || 0,
      euSales: parseFloat(record.EU_Sales) || 0,
      jpSales: parseFloat(record.JP_Sales) || 0,
      otherSales: parseFloat(record.Other_Sales) || 0,
      globalSales: parseFloat(record.Global_Sales) || 0
    })
  }

  await Game.insertMany(games)
  console.log(`Seeded ${games.length} games`)
}

/**
 * The main seed function.
 * Connects to the database, clears existing data and seed all of the collections.
 */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    console.log('Parsing CSV file...')
    const records = await parseCSV()
    console.log(`Parsed ${records.length} records from CSV`)

    await clearDatabase()

    // Seeds publishers first to get the ID map for the games.
    const publisherIdMap = await seedPublishers(records)
    await seedPlatforms(records)
    await seedGames(records, publisherIdMap)

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Seeding failed:', error.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seed()