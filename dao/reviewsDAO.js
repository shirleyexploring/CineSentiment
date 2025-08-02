import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

export default class ReviewsDAO {
  
  static reviews;

  static async injectDB(conn) {
    console.log("injecting – DAO id:", this); 
    if (this.reviews) {
      return
    }
    try {
      this.reviews = conn.db("reviews").collection("reviews")
      console.log("collection set:", !!this.reviews);  
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async getAllReviews() {
    try {
      return await this.reviews.find({}).toArray();   
    } catch (e) {
      console.error("getAllReviews error:", e);
     return [];                                     
    }
  }

  static async addReview(movieId, user, review, sentiment) {
    console.log("addReview – DAO id:", this, "collection:", !!this.reviews); 
    try {
      const reviewDoc = {
        movieId: movieId,
        user: user,
        review: review,
        sentiment: sentiment,
        date: new Date(), 
      }
      console.log("adding")
      return await this.reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async getReview(reviewId) {
    try {
      return await this.reviews.findOne({ _id: ObjectId(reviewId) })
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

  static async updateReview(reviewId, user, review) {
    try {
      const updateResponse = await this.reviews.updateOne(
        { _id: ObjectId(reviewId) },
        { $set: { user: user, review: review } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId) {

    try {
      const deleteResponse = await this.reviews.deleteOne({
        _id: ObjectId(reviewId),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsByMovieId(movieId) {
    try {
      const cursor = await this.reviews.find({ movieId: parseInt(movieId) })
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

}