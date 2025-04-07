import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';
import { useMutation } from '@apollo/client';
import { CREATE_AUCTION_MUTATION, UPDATE_AUCTION_MUTATION } from '../../../graphql/mutation/userMutation';
import './NewAuction.css'

const NewAuction = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const navigator = useNavigate()
    const {user, setUser, auction, setAuction } = useContext(GlobalContext)
    // const defaultImage = "https://superplayerauction.com/user/static/media/logo-auction.e6b9bfb3.png";
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [createAuctionMutation] = useMutation(CREATE_AUCTION_MUTATION);
    const [updateAuctionMutation] = useMutation(UPDATE_AUCTION_MUTATION);


    useEffect(() => {
        if (auction) {
            setValue("sports", auction.sportsType || "");
            setValue("name", auction.auctionName || "");

            let formattedDate = "";
            if (auction.date) {
                const dateObject = new Date(Number(auction.date));
                if (!isNaN(dateObject.getTime())) {
                    formattedDate = dateObject.toISOString().split("T")[0];
                }
            }
            setValue("date", auction.date || "");
            setValue("time", auction.time || "");
            setValue("base_bit", auction.baseBid || 0);
            setValue("bit_increse_by", auction.bidIncreaseBy || 0);
            setValue("max_player", auction.maxPlayer || 0);
            setValue("min_player", auction.minPlayer || 0);
        }
    }, [auction, setValue]);

    const onSubmit = async (auctionData) => {
        try {

            const newEntity = {
                sportsType: auctionData.sports || "",
                auctionName: auctionData.name || "",
                date: auctionData.date || "",
                time: auctionData.time || "",
                baseBid: parseInt(auctionData.base_bit, 10) || 0,
                bidIncreaseBy: parseInt(auctionData.bit_increse_by, 10) || 0,
                maxPlayer: parseInt(auctionData.max_player, 10) || 0,
                minPlayer: parseInt(auctionData.min_player, 10) || 0
            };
            let res;
            if (auction?.auctionId) {
                res = await updateAuctionMutation({
                    variables: { ...newEntity, auctionId: auction.auctionId },
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                });
            } else {
                res = await createAuctionMutation({
                    variables:{ ...newEntity, creatorUserId : user?.user_id , auctionStatus : "PENDING" },
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                });
            }
            if (res.data) {
                setAuction(null)
                toast.success(auction ? "Auction Updated Successfully!" : "Auction Created Successfully!", { position: "top-right", autoClose: 1000 });
                navigator('/Dashboard/MyAuction');
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Issue in submission", { position: "top-right", autoClose: 2000 });
        }
    }

    const handleCancel = () => {
        setAuction(null)
        reset()
        navigator('/Dashboard/MyAuction')
    }

    return (
        <>
            <div id='New-main-div'>
                <div id='New-inner-div'>
                    <div id='New-header-div'>
                        <h1>
                            Create Auction
                        </h1>

                    </div>
                    <div id='New-body-div'>
                        <form onSubmit={handleSubmit(onSubmit)} id='new-form'>
                            <div className='from-sub-div'>
                                <div id='name-div' >
                                    <label className='req'>Sports Type </label>
                                    <select {...register("sports", { required: "Please select an option" })} className="dropdown">
                                        <option value="Cricket">Cricket</option>
                                        <option value="Football">Football</option>
                                        <option value="Volleyball">Volleyball</option>
                                        <option value="Tennis">Tennis</option>
                                        <option value="Badminton">Badminton</option>
                                    </select>
                                    {errors.Sports && <p className="error">{errors.Sports.message}</p>}
                                </div>

                                <div id='name-div'>
                                    <label className='req'> Auction name   </label>
                                    <input type="text" {...register("name", {
                                        required: "Auction name is required"
                                    })} placeholder="Enter the Auction name " className="inputs" />
                                    {errors.name && <p className="error">{errors.name.message}</p>}
                                </div>
                            </div>
                            <div className='from-sub-div'>
                                <div id='name-div'>
                                    <div id='name-div'>
                                        <label htmlFor="date" className='req'>Auction Date </label>
                                        <input
                                            id="date"
                                            type="date"
                                            {...register("date", { required: "Auction Date is required" })}
                                            className="inputs"
                                            min={new Date().toISOString().split("T")[0]}
                                            onFocus={(e) => e.target.showPicker()}
                                        />
                                        {errors.date && <p className="error">{errors.date.message}</p>}
                                    </div>

                                </div>
                                <div id='name-div'>
                                    <label className='req'> Auction Time </label>
                                    <input type="time" {...register("time", {
                                        required: "Auction Time is required"
                                    })} placeholder="Enter the Auction Time" className="inputs"
                                        onFocus={(e) => e.target.showPicker()}
                                    />
                                    {errors.time && <p className="error">{errors.time.message}</p>}
                                </div>
                            </div>
                            <div className='from-sub-div'>

                                <div id='name-div'>
                                    <label className='req'> Base Bid  </label>
                                    <input type="number" {...register("base_bit", {
                                        required: "Base Bid is required"
                                    })} placeholder="Enter the Base Bid " className="inputs" />
                                    {errors.base_bit && <p className="error">{errors.base_bit.message}</p>}
                                </div>
                                <div id='name-div'>
                                    <label className='req'> Bid Increase by </label>
                                    <input type="number" {...register("bit_increse_by", {
                                        required: "Bid Increase by is required"
                                    })} placeholder="Enter the Bid Increase by " className="inputs" />
                                    {errors.bit_increse_by && <p className="error">{errors.bit_increse_by.message}</p>}
                                </div>
                            </div>
                            <div className='from-sub-div'>
                                <div id='name-div'>
                                    <label className='req'> Player Per Team (min) </label>
                                    <input type="number" {...register("min_player", {
                                        required: "Min player is required"
                                    })} placeholder="Enter the Min player" className="inputs" />
                                    {errors.min_player && <p className="error">{errors.min_player.message}</p>}
                                </div>
                                <div id='name-div'>
                                    <label > Player Per Team (max) </label>
                                    <input type="number" {...register("max_player", {
                                        required: false
                                    })} placeholder="Enter the Max player " className="inputs" />
                                    {errors.max_player && <p className="error">{errors.max_player.message}</p>}
                                </div>
                            </div>
                            <div className='from-sub-div'>
                                <button type="submit" id="auction-sub" style={{ cursor: "pointer", fontWeight: "bolder" }}><b> {auction ? "Update" : "Submit"}</b></button>
                                {
                                    auction && <button type="submit" id="auction-cancel" onClick={handleCancel}><b> CANCEL </b></button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewAuction