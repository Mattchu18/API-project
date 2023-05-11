import { getAllReviews } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ReviewDelete from "../Reviews/ReviewDelete";
import OpenModalButton from "../OpenModalButton";
import CreateReviewForm from "../Reviews/CreateReviewForm"

const AllSpotsReviews = ({ spotId }) => {
    const dispatch = useDispatch();
    const reviewsObj = useSelector((state) => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    const sessionUser = useSelector((state) => state.session.user)
    console.log("sessionUser====>", sessionUser)
    console.log("AllSpotsReviews===>", reviews)

    useEffect(() => {
        dispatch(getAllReviews(spotId))

    }, [dispatch, spotId])

    if (!reviews) return null
    console.log("AllSpotsReviews===>", reviews)

    // const [userReview] = reviews.filter(review => review.userId === sessionUser.id)
    // console.log("userReview===>", userReview)
    // if( reviews.forEach( review =>
    //     review?.User ?? null
    // ))

    return (
        <>
            <div>
            {/* {reviews.map(review => {(
                sessionUser.id === review.userId && (
                    <CreateReviewForm
                    spotId={spotId} />
                )

                )})} */}

                {reviews.map(review => (
                    <ul key={review.id}>
                        <li>spotId: {review.spotId} </li>
{/* below will break my page when I delete a review and try to create a new review */}
                        {/* <li>reviewer: {review.User.firstName}</li> */}
                        <li>stars: {review.stars} </li>
                        <li>review: {review.review} </li>
                        <li>date: {review.createdAt}</li>

                        {sessionUser.id === review.userId && (
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<ReviewDelete
                                    review={review.id}
                                />}
                            />

                        )}

                        {/* <li>UserId: {review.userId} , User: {review.User.firstName}  </li> */}
                    </ul>
                ))}
            </div>

        </>

    )
}

export default AllSpotsReviews;
