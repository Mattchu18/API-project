const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const id = req.user.id;
    const reviewImg = await SpotImage.findAll({
        where: {
            preview: 'true'
        }
    })

    const reviews = await Review.findAll({
        where: {
            userId: id
        },
        include: [
            { model: User },
            {
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price'
                ],
                include: {
                    model: SpotImage
                }
            },
            {
                model: ReviewImage,
                attributes: [
                    'id',
                    'url'
                ]
            }
        ]
    });

    let arr = [];
    reviews.forEach(review => {
        arr.push(review.toJSON())
    })

    arr.forEach(review => {
        review.Spot.SpotImages.forEach(url => {
            if(url.preview === true){
                review.Spot.previewImage = url.url
            }
        })
    })

    arr.forEach(review => {
        delete review.Spot.SpotImages
    })

    res.json({
        "Reviews": arr
    })
})

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { url } = req.body;
    const reviewImage = await ReviewImage.findAll({
        where: {
            reviewId
        }
    });
    const belongs = await Review.findOne({
        where: {
            id: reviewId,
            userId
        }
    });
    const findReview = await Review.findByPk(reviewId)

    if (!findReview) {
        res.status(404).json({
            "message": "Review couldn't be found"
        })
    }

    if (!belongs) {
        res.status(403).json({
            "message": "Review must belong to the current user"
        })
    }
    // console.log(reviewImage.length)

    if (reviewImage.length >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    }

    const newReviewImage = await ReviewImage.create({
        reviewId,
        url
    })

    res.status(200).json({
        id: newReviewImage.id,
        url: newReviewImage.url
    })
});

const reviewChecker = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

// Edit a Review
router.put('/:reviewId', requireAuth, reviewChecker, async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { review, stars } = req.body;
    const belongs = await Review.findOne({
        where: {
            id: reviewId,
            userId
        }
    });
    const updatedReview = await Review.findByPk(reviewId);

    if(!updatedReview) {
        res.status(404).json({
            "message": "Review couldn't be found"
          })
    };
    if(!belongs) {
        res.status(403).json({
            "message": "Review must belong to the current user"
        })
    };

    updatedReview.review = review;
    updatedReview.stars = stars;

    await updatedReview.save();
    res.status(200).json(updatedReview);
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const belongs = await Review.findOne({
        where: {
            id: reviewId,
            userId
        }
    });
    const deleteReview = await Review.findByPk(reviewId);

    if(!deleteReview) {
        res.status(404).json({
            "message": "Review couldn't be found"
          })
    };
    if(!belongs) {
        res.status(403).json({
            "message": "Review must belong to the current user"
        })
    };

    deleteReview.destroy();

    return res.status(200).json({
        "message": "Successfully deleted"
      })
})

module.exports = router;
