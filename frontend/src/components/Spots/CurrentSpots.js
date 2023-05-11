import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getSpotCurrentUser } from "../../store/spots";
import DeleteSpot from "./DeleteSpot";
import SpotForm from "./SpotForm";
import OpenModalButton from "../OpenModalButton";
import EditSpotForm from "./EditSpotForm";

const CurrentSpots = () => {
    const dispatch = useDispatch();
    //get our spots
    const spotsObj = useSelector((state) => state.spots.allSpots)
    const spots = Object.values(spotsObj);
    console.log("inside currentSpots ===>", spots)


    useEffect(() => {
        dispatch(getSpotCurrentUser())
    }, [dispatch])

    return (
        <>
            <div>
                <h2>Manage Your Spots</h2>

                <Link to={"/spots/new"}>
                    <button>Create a New Spot</button>
                </Link>

            </div>
            <div>
                {spots.map(spot => (
                    <div key={spot.id}>
                        <Link to={`/spots/${spot.id}`}>{spot.name}</Link>
                        <img src={spot.previewImage} />
                        <p>spot id: {spot.id}</p>
                        <div>
                            <p>{spot.city}, {spot.state}</p>

                        </div>
                        <OpenModalButton
                            buttonText="Delete Spot"
                            modalComponent={
                                <DeleteSpot
                                    spot={spot}
                                />
                            }
                        />
                        <Link to={`/spots/${spot.id}/edit`}>
                            <button>
                                Update
                            </button>
                        </Link>

                    </div>
                ))}
            </div>

        </>
    )

}

export default CurrentSpots;
