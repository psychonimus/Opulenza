import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as signalR from '@microsoft/signalr'
import connection from '../../../../services/signalR/auctionSignalR'
import { getApprovedListing, updateWishListItem } from '../../../../services/sellingServices/getSellListings/getSellListings'
import { AddBid, getLatestBid } from '../../../../services/biddingServices/BiddingServices'

import './DetailedPage.css'

const DetailedPage = () => {

    const { id } = useParams(); // Route parameter is id (from App.jsx /watch/:id)
    const [watch, setWatch] = useState(null)
    const [watchData, setWatchData] = useState([])
    const [loading, setLoading] = useState(true)

    const calculateTimeLeft = (endDateStr) => {
        if (!endDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        const difference = +new Date(endDateStr) - +new Date()
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }
    }

    // SignalR Auction Room Connection
    useEffect(() => {
        const targetId = watch?.itemId || id;
        if (!targetId) return;

        const currentItemId = String(targetId);
        let isSubscribed = true;

        const connectToAuction = async () => {
            try {
                console.groupCollapsed(`%c[SignalR] Initializing Watch Item Room (Item ID: ${currentItemId})`, "color: #3b82f6; font-weight: bold;");
                console.log("Current Connection State:", connection.state);
                console.log("Connection ID:", connection.connectionId);
                console.groupEnd();

                if (connection.state === signalR.HubConnectionState.Disconnected) {
                    console.log("%c[SignalR ⏳] Starting connection to hub...", "color: #3b82f6; font-weight: bold;");
                    await connection.start();
                    console.log("%c[SignalR 🟢] Connected successfully!", "color: #10b981; font-weight: bold;", {
                        connectionId: connection.connectionId,
                        state: connection.state
                    });
                }

                if (connection.state === signalR.HubConnectionState.Connected) {
                    console.log("%c[SignalR 📡] Invoking 'JoinItem' for Item ID:", "color: #d4af37; font-weight: bold;", {
                        itemIdNumber: Number(currentItemId),
                        itemIdString: currentItemId
                    });
                    try {
                        const joinResult = await connection.invoke("JoinItem", Number(currentItemId));
                        console.log("%c[SignalR ✅] 'JoinItem' joined room successfully. Result:", "color: #10b981; font-weight: bold;", joinResult ?? "OK (void)");
                    } catch (joinErr) {
                        console.warn("%c[SignalR ⚠️] 'JoinItem' invocation rejected/failed:", "color: #f59e0b; font-weight: bold;", joinErr);
                    }
                }

                const handleIncomingSignalREvent = (eventName, ...args) => {
                    if (!isSubscribed) return;
                    const rawData = args.length === 1 ? args[0] : (args.length === 0 ? null : args);

                    console.group(`%c[SignalR ⚡ Event: ${eventName}]`, "background: #7c3aed; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px; font-size: 13px;");
                    console.log("%cTimestamp:", "color: #94a3b8;", new Date().toISOString(), `(${new Date().toLocaleTimeString()})`);
                    console.log("%cRaw Event Arguments:", "color: #38bdf8; font-weight: bold;", args);
                    console.log("%cCurrent Item ID in Page:", "color: #d4af37; font-weight: bold;", currentItemId);

                    let payloadObj = null;
                    let incomingId = '';
                    let newPrice = null;
                    let nextBid = null;
                    let count = null;
                    let latestBidsList = null;

                    if (args.length > 1 && (typeof args[0] === 'number' || typeof args[0] === 'string')) {
                        incomingId = String(args[0]);
                        if (typeof args[1] === 'object' && args[1] !== null) {
                            payloadObj = args[1];
                        } else {
                            newPrice = args[1];
                            count = args[2];
                            nextBid = args[3];
                        }
                    } else if (typeof rawData === 'string') {
                        try {
                            payloadObj = JSON.parse(rawData);
                        } catch {
                            payloadObj = rawData;
                        }
                    } else if (typeof rawData === 'object' && rawData !== null) {
                        payloadObj = Array.isArray(rawData) ? rawData[0] : rawData;
                    }

                    if (payloadObj && typeof payloadObj === 'object') {
                        incomingId = String(payloadObj.itemId ?? payloadObj.ItemId ?? payloadObj.id ?? payloadObj.Id ?? payloadObj.item_id ?? incomingId ?? '');
                        newPrice = payloadObj.currentPrice ?? payloadObj.CurrentPrice ?? payloadObj.currentBid ?? payloadObj.CurrentBid ?? payloadObj.bidAmount ?? payloadObj.BidAmount ?? payloadObj.price ?? payloadObj.Price ?? payloadObj.amount ?? payloadObj.Amount ?? payloadObj.highestBid ?? payloadObj.HighestBid ?? newPrice;
                        nextBid = payloadObj.minNextBid ?? payloadObj.MinNextBid ?? payloadObj.nextBid ?? payloadObj.NextBid ?? payloadObj.bidIncrement ?? payloadObj.BidIncrement ?? payloadObj.nextMinimumBid ?? payloadObj.NextMinimumBid ?? nextBid;
                        count = payloadObj.countOfBidders ?? payloadObj.CountOfBidders ?? payloadObj.activeBidders ?? payloadObj.ActiveBidders ?? payloadObj.biddersCount ?? payloadObj.BiddersCount ?? payloadObj.totalBidders ?? count;
                        latestBidsList = payloadObj.latestBids ?? payloadObj.LatestBids ?? payloadObj.bids ?? payloadObj.Bids ?? payloadObj.bidHistory;
                    }

                    console.log("%cItem ID Check:", "color: #10b981; font-weight: bold;", {
                        incomingId: incomingId || "(no itemId provided, matching current item)",
                        currentItemId,
                        matches: !incomingId || incomingId === currentItemId
                    });

                    if (!incomingId || incomingId === currentItemId) {
                        console.log("%cParsed Real-Time Values from '" + eventName + "':", "color: #ec4899; font-weight: bold;", {
                            newPrice,
                            nextBid,
                            biddersCount: count,
                            latestBidsList
                        });

                        if (newPrice != null && !isNaN(Number(newPrice))) {
                            setCurrentBid(Number(newPrice));
                        }
                        if (nextBid != null && !isNaN(Number(nextBid))) {
                            setCustomBidAmount(Number(nextBid));
                        } else if (newPrice != null && !isNaN(Number(newPrice))) {
                            setCustomBidAmount(Number(newPrice) + (watch?.bidIncrement || 500));
                        }
                        if (count != null && !isNaN(Number(count))) {
                            setBiddersCount(Number(count));
                        }
                        if (Array.isArray(latestBidsList) && latestBidsList.length > 0) {
                            setBids(latestBidsList);
                        }

                        setWatch((prev) => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                currentBidNumber: newPrice != null ? Number(newPrice) : prev.currentBidNumber,
                                bidIncrement: nextBid != null ? Number(nextBid) : prev.bidIncrement,
                                activeBidders: count != null ? Number(count) : prev.activeBidders
                            };
                        });

                        fetchLatestBid();
                    }
                    console.groupEnd();
                };

                const events = [
                    "bidchanged",
                    "BidChanged",
                    "bidChanged",
                    "bidchange",
                    "BidChange",
                    "BidUpdated",
                    "bidUpdated",
                    "bidupdated",
                    "ReceiveBid",
                    "receiveBid",
                    "BidPlaced",
                    "bidPlaced",
                    "bidplaced",
                    "UpdateBid",
                    "updateBid",
                    "ReceiveBidUpdate",
                    "receiveBidUpdate",
                    "NewBid",
                    "newBid",
                    "ItemBidUpdated",
                    "itemBidUpdated",
                    "ReceiveBiddingUpdate",
                    "AuctionUpdated",
                    "auctionUpdated",
                    "BiddingUpdated",
                    "biddingUpdated",
                    "OnBidPlaced",
                    "OnBidUpdated",
                    "ReceiveMessage"
                ];

                events.forEach((ev) => {
                    connection.off(ev);
                    connection.on(ev, (...args) => handleIncomingSignalREvent(ev, ...args));
                });
            } catch (error) {
                console.error("%c[SignalR ❌] Connection or invocation error:", "color: #ef4444; font-weight: bold;", error);
            }
        };

        connectToAuction();

        return () => {
            isSubscribed = false;
            if (connection.state === signalR.HubConnectionState.Connected) {
                console.log("%c[SignalR 🚪] Leaving auction room for Item ID:", "color: #64748b;", Number(currentItemId));
                connection.invoke("LeaveItem", Number(currentItemId)).catch((err) => console.warn("[SignalR] LeaveItem warning:", err));
            }
            const events = [
                "bidchanged",
                "BidChanged",
                "bidChanged",
                "bidchange",
                "BidChange",
                "BidUpdated",
                "bidUpdated",
                "bidupdated",
                "ReceiveBid",
                "receiveBid",
                "BidPlaced",
                "bidPlaced",
                "bidplaced",
                "UpdateBid",
                "updateBid",
                "ReceiveBidUpdate",
                "receiveBidUpdate",
                "NewBid",
                "newBid",
                "ItemBidUpdated",
                "itemBidUpdated",
                "ReceiveBiddingUpdate",
                "AuctionUpdated",
                "auctionUpdated",
                "BiddingUpdated",
                "biddingUpdated",
                "OnBidPlaced",
                "OnBidUpdated",
                "ReceiveMessage"
            ];
            events.forEach((ev) => connection.off(ev));
        };
    }, [id, watch?.itemId]);

    const fetchLatestBid = () => {
        const targetId = watch?.itemId || id;
        if (!targetId) return;

        console.groupCollapsed(`%c[Bidding API 🔍] Fetching Latest Bid (Item ID: ${targetId})`, "color: #38bdf8; font-weight: bold;");
        console.log("Endpoint: GET api/itembid/latest-bids/" + targetId);
        console.log("Timestamp:", new Date().toLocaleTimeString());

        getLatestBid(targetId)
            .then((res) => {
                const raw = res?.data;
                const dataObj = raw?.data || raw;

                console.log("%cLatest Bid API Response:", "color: #10b981; font-weight: bold;", {
                    httpStatus: res?.status,
                    data: raw
                });

                if (Array.isArray(raw)) {
                    const match = raw.find((b) => Number(b.itemId) === Number(targetId));
                    if (match) {
                        const curBid = match.bidData?.currentBid ?? match.currentBid;
                        const nextB = match.bidData?.nextBid ?? match.nextBid;
                        const countB = match.countOfBidders ?? match.activeBidders;
                        if (curBid != null) setCurrentBid(Number(curBid));
                        if (countB != null) setBiddersCount(Number(countB));
                        if (match.latestBids) setBids(match.latestBids);
                        setWatch((prev) =>
                            prev
                                ? {
                                    ...prev,
                                    currentBidNumber: curBid != null ? Number(curBid) : prev.currentBidNumber,
                                    bidIncrement: nextB != null ? Number(nextB) : prev.bidIncrement,
                                    activeBidders: countB != null ? Number(countB) : prev.activeBidders,
                                }
                                : prev
                        );
                    }
                } else if (dataObj && typeof dataObj === "object") {
                    const countB = dataObj.countOfBidders ?? dataObj.activeBidders ?? dataObj.biddersCount;
                    const curBid = dataObj.currentBid ?? dataObj.bidData?.currentBid ?? dataObj.currentPrice;
                    const nextB = dataObj.nextBid ?? dataObj.bidData?.nextBid ?? dataObj.minNextBid ?? dataObj.bidIncrement;
                    const latestB = dataObj.latestBids ?? dataObj.bids;

                    if (countB != null) setBiddersCount(Number(countB));
                    if (curBid != null) setCurrentBid(Number(curBid));
                    if (Array.isArray(latestB)) setBids(latestB);
                    setWatch((prev) =>
                        prev
                            ? {
                                ...prev,
                                currentBidNumber: curBid != null ? Number(curBid) : prev.currentBidNumber,
                                bidIncrement: nextB != null ? Number(nextB) : prev.bidIncrement,
                                activeBidders: countB != null ? Number(countB) : prev.activeBidders,
                            }
                            : prev
                    );
                }
                console.groupEnd();
            })
            .catch((err) => {
                console.error("%c[Bidding API ❌] fetchLatestBid error:", "color: #ef4444; font-weight: bold;", {
                    status: err?.response?.status,
                    data: err?.response?.data,
                    message: err?.message,
                });
                console.groupEnd();
            });
    };

    useEffect(() => {
        if (watch?.itemId) {
            fetchLatestBid();
        }
    }, [watch?.itemId]);

    useEffect(() => {
        setLoading(true)
        getApprovedListing(3)
            .then((res) => {
                const list = res?.data?.data || []
                setWatchData(list)
                const found = list.find(w => w.itemId === Number(id))
                if (found) {
                    const mappedWatch = {
                        id: found.itemId,
                        itemId: found.itemId,
                        title: found.details?.brand || found.categoryName || "Timepiece",
                        reference: found.details?.model || "",
                        description: `Year of purchase: ${found.details?.yearOfPurchase || 'N/A'}`,
                        detailedDescription: `This is an exceptional ${found.details?.brand || 'timepiece'} with serial number ${found.details?.serialNumber || 'N/A'}.`,
                        image: found.details?.thumbnail || found.details?.image1,
                        angles: [found.details?.image2, found.details?.image3, found.details?.image4, found.details?.image5].filter(Boolean),
                        // activeBidders: 0,
                        auctionEndDate: found.auctionEndDate,
                        currency: found.currency || 'USD',
                        isWishList: found.isWishList,
                        canBid: found.canUserBid,
                        // liveActivity: [
                        //     { id: 1, member: 'MEMBER #7***3', timeAgo: '2 minutes ago', timestamp: Date.now() - 120000, amount: `$${found.currentPrice || found.expectedPrice || 1500}`, amountNumber: found.currentPrice || found.expectedPrice || 1500 }
                        // ],
                        ownershipHistory: {
                            title: 'Original Provenance',
                            description: `This watch was acquired in ${found.details?.yearOfPurchase || 'N/A'} and has serial number ${found.details?.serialNumber || 'N/A'}. It comes with ${found.details?.papers ? 'original papers' : 'no papers'} and ${found.details?.boxAndPaper ? 'original box & papers' : 'no box/papers'}.`,
                            timeline: [
                                { period: found.details?.yearOfPurchase || 'N/A', detail: 'Purchased by the original owner' },
                                { period: 'PRESENT', detail: 'Opulenza Authenticated Custody' }
                            ]
                        },
                        authentication: `This timepiece has been fully authenticated. Serial number ${found.details?.serialNumber || 'N/A'} is confirmed authentic. Certificates: ${found.details?.certificates ? 'Included' : 'Verified by experts'}.`,
                        conditionReport: `Pristine condition. Checked movement, strap, case back (${found.details?.caseBack ? 'Verified' : 'N/A'}) and side profiles (${found.details?.side ? 'Verified' : 'N/A'}).`
                    }
                    setWatch(mappedWatch)
                    setIsFavorited(found.isWishList)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [id])


    const handleWishList = () => {
        const dataObject = {
            ItemId: watch?.itemId,
            IsWishList: !isFavorited
        }
        updateWishListItem(dataObject)
            .then((res) => {
                // console.log(res)
                setIsFavorited(!isFavorited)
            })
            .catch((err) => {
                console.error(err)
            })

    }

    // Tab State: 'history' | 'auth' | 'condition'
    const [activeTab, setActiveTab] = useState('history');

    // Bidding States
    const [currentBid, setCurrentBid] = useState(0);
    const [bids, setBids] = useState([]);
    const [biddersCount, setBiddersCount] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isAutoBidding, setIsAutoBidding] = useState(false);

    // Magnifier state
    const magnifierRef = useRef(null);
    const [magnifier, setMagnifier] = useState({
        visible: false,
        x: 0, y: 0,
        bgX: 0, bgY: 0,
        wrapperW: 0, wrapperH: 0,
    });
    const LENS_SIZE = 160;  // lens diameter in px
    const ZOOM = 2.5;       // zoom multiplier

    const handleMagnifierMove = useCallback((e) => {
        const wrapper = magnifierRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const bgX = -(x * ZOOM - LENS_SIZE / 2);
        const bgY = -(y * ZOOM - LENS_SIZE / 2);
        setMagnifier({
            visible: true,
            x, y,
            bgX, bgY,
            wrapperW: rect.width,
            wrapperH: rect.height,
        });
    }, [LENS_SIZE, ZOOM]);

    const handleMagnifierLeave = useCallback(() => {
        setMagnifier(prev => ({ ...prev, visible: false }));
    }, []);

    // Image gallery state
    const [mainImage, setMainImage] = useState('');

    // Modal State for custom placing bid
    const [showBidModal, setShowBidModal] = useState(false);
    const [customBidAmount, setCustomBidAmount] = useState(0);
    const [bidError, setBidError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [modalAutoBid, setModalAutoBid] = useState(false);

    // Dynamic Timer countdown
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (watch) {
            setCurrentBid(watch.currentBidNumber)
            // setBids(watch.liveActivity || [])
            // setBiddersCount(watch.activeBidders || 0)
            setMainImage(watch.image)
            setCustomBidAmount(watch.currentBidNumber + watch.bidIncrement)
            setTimeLeft(watch.auctionEndDate ? calculateTimeLeft(watch.auctionEndDate) : { days: 1, hours: 4, minutes: 18, seconds: 40 })
        }
    }, [watch])

    useEffect(() => {
        if (!watch || !watch.auctionEndDate) return
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(watch.auctionEndDate))
        }, 1000)
        return () => clearInterval(timer)
    }, [watch])

    // Auto-bid simulation background loop
    useEffect(() => {
        let simInterval;
        if (isAutoBidding && watch) {
            simInterval = setInterval(() => {
                // 35% chance to place a bid on each tick
                if (Math.random() < 0.35) {
                    const increment = watch.bidIncrement;
                    setCurrentBid(prev => {
                        const newAmt = prev + increment;
                        const newBidObj = {
                            id: Date.now(),
                            member: `MEMBER #${Math.floor(Math.random() * 9 + 1)}***${Math.floor(Math.random() * 9 + 1)}`,
                            timeAgo: 'Just now',
                            timestamp: Date.now(),
                            amount: formatCurrency(newAmt),
                            amountNumber: newAmt
                        };
                        setBids(prevList => [newBidObj, ...prevList]);
                        setBiddersCount(bc => bc + 1);
                        return newAmt;
                    });
                }
            }, 7000); // Check every 7 seconds
        }

        return () => {
            if (simInterval) clearInterval(simInterval);
        };
    }, [isAutoBidding, watch?.bidIncrement, watch]);

    // Handle loading state
    if (loading) {
        return (
            <div className="watch-not-found">
                <div className="container text-center py-5">
                    <span className="ap-spin" style={{ color: '#d6a54d' }}>Loading details...</span>
                </div>
            </div>
        )
    }

    // Handle invalid watch ID (Early return after all hooks are declared)
    if (!watch) {
        return (
            <div className="watch-not-found">
                <div className="container text-center py-5">
                    <h2 className="error-title">Timepiece Not Found</h2>
                    <p className="error-desc">The watch listing you are looking for does not exist or has been archived.</p>
                    <Link to="/watchListing" className="back-btn">RETURN TO LISTINGS</Link>
                </div>
            </div>
        );
    }

    // Helper to format currency
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Helper to format number padding
    const formatNum = (num) => String(num).padStart(2, '0');

    // Dynamic Thumbnail image list
    const thumbnails = [
        watch.image,
        ...watch.angles
    ];

    // Place Bid Action handler
    const handlePlaceBidClick = () => {
        setCustomBidAmount(watch?.bidIncrement || 0);
        setBidError('');
        setShowBidModal(true);
    };

    const submitCustomBid = (e) => {
        e.preventDefault();
        const amt = Number(customBidAmount);
        const minRequired = watch?.bidIncrement || 0;

        if (isNaN(amt) || amt < minRequired) {
            console.warn("[BID PLACEMENT] Validation failed: Bid amount is lower than minimum required increment.", {
                enteredAmount: amt,
                minRequired
            });
            setBidError(`Bid must be at least ${formatCurrency(minRequired)}`);
            return;
        }

        const payload = {
            ItemId: watch.itemId,
            BidAmount: amt,
            Currency: watch.currency || "USD"
        }

        const localTime = new Date().toLocaleTimeString();
        let tokenInStorage = null;
        try {
            tokenInStorage = localStorage.getItem("token") || (localStorage.getItem("authState") ? JSON.parse(localStorage.getItem("authState"))?.accessToken : null);
        } catch {
            tokenInStorage = localStorage.getItem("token");
        }

        console.group(`%c[BID PLACEMENT 💰] Placing Watch Bid of ${formatCurrency(amt)} at ${localTime}`, "background: #d4af37; color: #000; font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 13px;");
        console.log("%c🎯 Item Details:", "color: #d4af37; font-weight: bold;", {
            itemId: watch.itemId,
            title: watch.title,
            currentBidOnUI: currentBid,
            bidIncrement: watch.bidIncrement
        });
        console.log("%c📤 Request Payload (POST api/itembid/AddBid):", "color: #38bdf8; font-weight: bold;", payload);
        console.log("%c🔑 Auth Token Status:", "color: #10b981; font-weight: bold;", {
            hasToken: !!tokenInStorage,
            tokenPreview: tokenInStorage ? `${tokenInStorage.slice(0, 10)}...${tokenInStorage.slice(-8)}` : "❌ NO TOKEN FOUND IN STORAGE"
        });
        console.log("%c⚡ SignalR Connection Status:", "color: #a855f7; font-weight: bold;", {
            state: connection.state,
            connectionId: connection.connectionId || "N/A"
        });

        AddBid(payload)
            .then((res) => {
                console.log("%c[BID PLACEMENT ✅ SUCCESS]", "background: #10b981; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;", {
                    status: res?.status,
                    statusText: res?.statusText,
                    responseData: res?.data
                });
                console.groupEnd();

                // Apply new bid
                const newBidObj = {
                    id: Date.now(),
                    bidId: Date.now(),
                    name: 'You',
                    member: `MEMBER #YOU***${Math.floor(Math.random() * 9 + 1)}`,
                    timeAgo: 'Just now',
                    bidDate: 'Just now',
                    timestamp: Date.now(),
                    amount: formatCurrency(amt),
                    bidAmount: amt,
                    amountNumber: amt
                };

                setCurrentBid(amt);
                setBids(prev => [newBidObj, ...prev]);
                setBiddersCount(prev => (prev || 0) + 1);
                fetchLatestBid();
                setShowBidModal(false);
                setSuccessMessage(`Bid of ${formatCurrency(amt)} placed successfully!`);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 4000);
            })
            .catch((err) => {
                console.error("%c[BID PLACEMENT ❌ FAILED]", "background: #ef4444; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;", {
                    httpStatus: err?.response?.status,
                    statusText: err?.response?.statusText,
                    backendResponseData: err?.response?.data,
                    backendMessage: err?.response?.data?.message || err?.response?.data?.title || err?.message,
                    payloadSent: payload,
                    fullAxiosError: err
                });
                console.groupEnd();

                setBidError(err?.response?.data?.message || err?.response?.data?.title || err?.message || 'Failed to place bid. Please try again.');
            });
    };

    return (
        <>

            <section className="detailed-page">
                <div className="detailed-page__bg-overlay"></div>
                <div className="container detailed-page__container">

                    {/* Back to listings link */}
                    <div className="detailed-page__breadcrumb">
                        <Link to="/watchListing" className="breadcrumb-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="breadcrumb-arrow">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Listings
                        </Link>
                    </div>

                    {successMessage && (
                        <div className="bid-toast-notification">
                            <div className="toast-content">
                                <span className="toast-dot"></span>
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Primary Column Layout */}
                    <div className="detailed-page__grid">

                        {/* Left Column: Image and Description */}
                        <div className="detailed-page__gallery-and-info">

                            {/* Main Image Frame */}
                            <div
                                className="detailed-page__main-image-wrapper"
                                ref={magnifierRef}
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <img src={mainImage} alt={watch.title} className="detailed-page__main-image" />
                                <div className="detailed-page__image-glow"></div>

                                {/* Circular magnifier lens */}
                                {magnifier.visible && (
                                    <div
                                        className="detailed-page__magnifier-lens"
                                        style={{
                                            width: LENS_SIZE,
                                            height: LENS_SIZE,
                                            left: magnifier.x - LENS_SIZE / 2,
                                            top: magnifier.y - LENS_SIZE / 2,
                                            backgroundImage: `url(${mainImage})`,
                                            // backgroundSize must be in px for the offset math to work
                                            backgroundSize: `${magnifier.wrapperW * ZOOM}px ${magnifier.wrapperH * ZOOM}px`,
                                            backgroundPosition: `${magnifier.bgX}px ${magnifier.bgY}px`,
                                        }}
                                    />
                                )}
                            </div>

                            {/* Watch Title */}
                            <h1 className="detailed-page__title">
                                {watch.title} <span className="detailed-page__reference">{watch.reference}</span>
                            </h1>

                            {/* Description */}
                            <p className="detailed-page__description">
                                {watch.detailedDescription || watch.description}
                            </p>

                            {/* Thumbnail Selector */}
                            <div className="detailed-page__thumbnails">
                                {thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className={`detailed-page__thumb-item ${mainImage === thumb ? 'detailed-page__thumb-item--active' : ''}`}
                                        onClick={() => setMainImage(thumb)}
                                    >
                                        <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="detailed-page__thumb-img" />
                                        {/* {idx === 3 && (
                                            <div className="detailed-page__thumb-overlay">
                                                <span>+12</span>
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Right Column: Bid Panel Sidebar */}
                        <div className="detailed-page__sidebar">
                            <div className="detailed-page__card">

                                {/* Time Remaining Timer */}
                                <div className="detailed-page__timer-section">
                                    <span className="detailed-page__timer-title">TIME REMAINING</span>
                                    <div className="detailed-page__timer-row">
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.days)}</span>
                                            <span className="timer-label">DAYS</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.hours)}</span>
                                            <span className="timer-label">HRS</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.minutes)}</span>
                                            <span className="timer-label">MIN</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-number">{formatNum(timeLeft.seconds)}</span>
                                            <span className="timer-label">SEC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="sidebar-divider"></div>

                                {/* Current Bid & Reserve status */}
                                <div className="detailed-page__bid-status">
                                    <div className="bid-status-col">
                                        <span className="panel-label">CURRENT BID</span>
                                        <span className="panel-value panel-value--large">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="bid-status-col text-right">
                                        <span className="panel-label">RESERVE</span>
                                        <span className={`panel-value panel-value--reserve ${watch.reserveMet || currentBid >= (watch.currentBidNumber * 1.05) ? 'reserve-met' : ''}`}>
                                            {watch.reserveMet || currentBid >= (watch.currentBidNumber * 1.05) ? (
                                                <>
                                                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    MET
                                                </>
                                            ) : 'NOT MET'}
                                        </span>
                                    </div>
                                </div>

                                <div className="sidebar-divider"></div>

                                {/* Increment and Bidders */}
                                <div className="detailed-page__bid-specs">
                                    <div className="spec-col">
                                        <span className="panel-label">BID INCREMENT:</span>
                                        <span className="panel-value">{formatCurrency(watch.bidIncrement)}</span>
                                    </div>
                                    <div className="spec-col text-right">
                                        <span className="panel-value">{biddersCount} ACTIVE</span>
                                        <span className="panel-label">BIDDERS</span>
                                    </div>
                                </div>

                                {/* Main Bid Action Button */}
                                {
                                    watch?.canBid && (
                                        <button className="detailed-page__place-bid-btn" onClick={handlePlaceBidClick}>
                                            PLACE BID
                                        </button>
                                    )
                                }

                                {/* Secondary Buttons (Auto Bid, Watch) */}
                                <div className="detailed-page__action-row">
                                    {/* <button
                                        className={`action-btn-secondary ${isAutoBidding ? 'action-btn-secondary--active' : ''}`}
                                        onClick={() => setIsAutoBidding(!isAutoBidding)}
                                        title="Toggle automatic bidding mode"
                                    >
                                        <svg className="action-icon" viewBox="0 0 24 24" fill={isAutoBidding ? '#000' : 'none'} stroke="currentColor" strokeWidth="2">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                        </svg>
                                        {isAutoBidding ? 'AUTO BID ACTIVE' : 'AUTO BID'}
                                    </button> */}
                                    {
                                        watch?.canBid && (
                                            <button
                                                className={`action-btn-secondary ${isFavorited ? 'action-btn-secondary--active' : ''}`}
                                                onClick={() => { handleWishList() }}
                                            >
                                                <svg className="action-icon" viewBox="0 0 24 24" fill={isFavorited ? '#e1af4a' : 'none'} stroke={isFavorited ? '#e1af4a' : 'currentColor'} strokeWidth="2">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                                {isFavorited ? 'Added to watchlist' : 'Add to Watchlist'}
                                            </button>
                                        )
                                    }
                                </div>

                                <div className="sidebar-divider"></div>

                                {/* Live Activity Logs */}
                                <div className="detailed-page__live-activity">
                                    <div className="live-activity-header">
                                        <span className="live-activity-title">LIVE ACTIVITY</span>
                                        <span className="live-pulse"></span>
                                    </div>
                                    <div className="live-activity-list" data-lenis-prevent="true">
                                        {(!bids || bids.length === 0) ? (
                                            <div className="live-activity-empty">
                                                <span>No bids placed yet</span>
                                            </div>
                                        ) : (
                                            bids.map((bid, index) => {
                                                const isHighest = index === 0;
                                                const displayName = bid.name || bid.member || `Bidder #${bid.userId || bid.bidderId || index + 1}`;
                                                const displayTime = bid.bidDate || bid.timeAgo || (bid.timestamp ? new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now');
                                                const rawAmt = bid.bidAmount ?? bid.amountNumber ?? (typeof bid.amount === 'string' ? bid.amount.replace(/[^0-9.]/g, '') : bid.amount);
                                                const displayAmt = !isNaN(Number(rawAmt)) && rawAmt !== null && rawAmt !== '' ? formatCurrency(Number(rawAmt)) : (bid.amount || `$ ${rawAmt || 0}`);

                                                return (
                                                    <div
                                                        className={`live-bid-item ${isHighest ? 'live-bid-item--winning' : ''}`}
                                                        key={bid.bidId || bid.id || index}
                                                    >
                                                        <div className="bid-user-info">
                                                            <div className="bid-user-headline">
                                                                <span className="bid-username">{index + 1}. {displayName}</span>
                                                                {isHighest && (
                                                                    <span className="bid-winning-badge">
                                                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="bid-winning-crown-icon">
                                                                            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                                                                        </svg>
                                                                        WINNING
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="bid-timestamp">{displayTime}</span>
                                                        </div>
                                                        <div className={`bid-amount-value ${isHighest ? 'bid-amount-value--winning' : ''}`}>
                                                            {displayAmt}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Bottom Section: Tabs Area */}
                    <div className="detailed-page__tabs-container">

                        {/* Tab Navigation Headers */}
                        <div className="detailed-page__tabs-header">
                            <button
                                className={`tab-link-btn ${activeTab === 'history' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                OWNERSHIP HISTORY
                                {activeTab === 'history' && <span className="tab-indicator"></span>}
                            </button>
                            <button
                                className={`tab-link-btn ${activeTab === 'auth' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('auth')}
                            >
                                AUTHENTICATION
                                {activeTab === 'auth' && <span className="tab-indicator"></span>}
                            </button>
                            <button
                                className={`tab-link-btn ${activeTab === 'condition' ? 'tab-link-btn--active' : ''}`}
                                onClick={() => setActiveTab('condition')}
                            >
                                CONDITION REPORT
                                {activeTab === 'condition' && <span className="tab-indicator"></span>}
                            </button>
                        </div>

                        {/* Tab Panels */}
                        <div className="detailed-page__tabs-content">

                            {activeTab === 'history' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">{watch.ownershipHistory?.title || 'Decades of Excellence'}</h3>
                                        <p className="tab-panel-text">
                                            {watch.ownershipHistory?.description || 'This timepiece has been meticulously preserved by collectors, showing excellent chain of custody and stored in secure, climate-controlled environments.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="ownership-timeline">
                                            {watch.ownershipHistory?.timeline?.map((item, idx) => (
                                                <div className="timeline-card" key={idx}>
                                                    <span className="timeline-period">{item.period}</span>
                                                    <p className="timeline-detail">{item.detail}</p>
                                                </div>
                                            )) || (
                                                    <>
                                                        <div className="timeline-card">
                                                            <span className="timeline-period">1962-2024</span>
                                                            <p className="timeline-detail">Private Estate Collection</p>
                                                        </div>
                                                        <div className="timeline-card">
                                                            <span className="timeline-period">2024-PRESENT</span>
                                                            <p className="timeline-detail">Curated Asset Holding</p>
                                                        </div>
                                                    </>
                                                )}
                                        </div>
                                        <button className="view-registry-btn">
                                            VIEW FULL REGISTRY
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'auth' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Certified Authenticity</h3>
                                        <p className="tab-panel-text">
                                            {watch.authentication || 'Every watch listed is subjected to a rigorous physical evaluation, verification of serial numbers against registry catalogs, and movement inspection by our horology experts.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="auth-checks-list">
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Official Manufacturer Archive Extract</span>
                                            </div>
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Case & Serial Registration Audit</span>
                                            </div>
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Movement Escapement & Amplitude Certified</span>
                                            </div>
                                            <div className="auth-check-item">
                                                <svg className="auth-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                <span>Full Provenance Dossier Sealed</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'condition' && (
                                <div className="tab-panel-grid fade-in-animation">
                                    <div className="tab-panel-info">
                                        <h3 className="tab-panel-heading">Condition Assessment</h3>
                                        <p className="tab-panel-text">
                                            {watch.conditionReport || 'This timepiece remains in pristine vintage state. Micro-wear is consistent with carefully stored museum-grade relics.'}
                                        </p>
                                    </div>
                                    <div className="tab-panel-interactive">
                                        <div className="condition-grades-grid">
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">CASE</span>
                                                <span className="condition-val">Grade 1.5 (Mint)</span>
                                            </div>
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">DIAL & HANDS</span>
                                                <span className="condition-val">Unrestored Tritium</span>
                                            </div>
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">GLASS</span>
                                                <span className="condition-val">Original Sapphire</span>
                                            </div>
                                            <div className="condition-grade-item">
                                                <span className="condition-lbl">MOVEMENT</span>
                                                <span className="condition-val">Serviced (295° Amp)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* Custom Interactive Bidding Modal overlay */}
                {showBidModal && (
                    <div className="bid-modal-overlay fade-in-animation">
                        <div className="bid-modal-card">

                            {/* Close */}
                            <button className="close-modal-btn" onClick={() => setShowBidModal(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            {/* Header */}
                            <div className="modal-header">
                                <span className="modal-auction-badge">AUCTION LIVE</span>
                                <h2 className="modal-title">Place Your Bid</h2>
                            </div>

                            {/* Asset Preview Card */}
                            <div className="modal-asset-card">
                                <div className="modal-asset-thumb">
                                    <img src={watch.image} alt={watch.title} />
                                </div>
                                <div className="modal-asset-info">
                                    <span className="modal-asset-label">CURRENT ASSET</span>
                                    <p className="modal-asset-name">{watch.title} <span>{watch.reference}</span></p>
                                </div>
                            </div>

                            <form onSubmit={submitCustomBid} className="modal-form">
                                {/* Current Bid / Min Next Bid */}
                                <div className="modal-bid-row">
                                    <div className="modal-bid-stat">
                                        <span className="modal-bid-stat-label">CURRENT BID</span>
                                        <span className="modal-bid-stat-value">{formatCurrency(currentBid)}</span>
                                    </div>
                                    <div className="modal-bid-stat modal-bid-stat--right">
                                        <span className="modal-bid-stat-label">MIN. NEXT BID</span>
                                        <span className="modal-bid-stat-value modal-bid-stat-value--gold">${watch.bidIncrement}</span>
                                    </div>
                                </div>

                                {/* Bid Amount Input */}
                                <div className="modal-input-section">
                                    <label className="modal-input-label">YOUR BID AMOUNT (USD)</label>
                                    <div className="modal-input-wrapper">
                                        <span className="currency-prefix">$</span>
                                        <input
                                            type="number"
                                            className="modal-bid-input"
                                            value={customBidAmount}
                                            onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                            min={watch?.bidIncrement}
                                            step={1}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {bidError && <p className="modal-error-msg">{bidError}</p>}
                                </div>

                                {/* Auto Bid Toggle */}
                                {/* <div className="modal-autobid-row">
                                    <div className="modal-autobid-text">
                                        <span className="modal-autobid-title">Auto Bid</span>
                                        <span className="modal-autobid-sub">AUREUS WILL BID UP TO YOUR LIMIT</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`modal-toggle${modalAutoBid ? ' modal-toggle--on' : ''}`}
                                        onClick={() => setModalAutoBid(v => !v)}
                                        aria-label="Toggle auto bid"
                                    >
                                        <span className="modal-toggle-knob" />
                                    </button>
                                </div> */}

                                {/* Terms Checkbox */}
                                <label className="modal-terms-row">
                                    <input
                                        type="checkbox"
                                        className="modal-terms-check"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span className="modal-terms-text">
                                        I accept the <span className="modal-terms-link">Terms of Service</span> and acknowledge that this bid constitutes a legally binding contract to purchase the asset.
                                    </span>
                                </label>

                                {/* Confirm Button */}
                                <button
                                    type="submit"
                                    className="submit-bid-btn"
                                    disabled={!termsAccepted}
                                >
                                    CONFIRM BID
                                </button>

                                {/* Secure Vault Footer */}
                                <div className="modal-secure-footer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>SECURE VAULT ENCRYPTION</span>
                                </div>

                            </form>
                        </div>
                    </div>
                )}


                {/* <div className="container">
                    <div className="recommended-section">
                        <div className="recommended-header">
                            <div className="recommended-title-container">
                                <span className="recommended-subtitle">CURATED FOR YOU</span>
                                <h2 className="recommended-title">Continue Your Discovery</h2>
                            </div>
                            <Link to="/watchListing" className="view-all-auctions-link">
                                VIEW ALL LIVE AUCTIONS
                            </Link>
                        </div>

                        <div className="recommended-grid">
                            {watchData
                                .filter(w => w.itemId !== watch.itemId)
                                .slice(0, 3)
                                .map(rec => (
                                    <Link to={`/watch/${rec.itemId}`} key={rec.itemId} className="recommended-card-link">
                                        <div className="recommended-card">
                                            <div className="recommended-card__image-container">
                                                <img src={rec.details?.front || rec.image} alt={`${rec.details?.brand || rec.title} ${rec.details?.model || rec.reference}`} className="recommended-card__image" />
                                                <div className="recommended-card__gradient-overlay"></div>
                                            </div>
                                            <div className="recommended-card__info">
                                                <span className="recommended-card__badge">LIVE</span>
                                                <h3 className="recommended-card__title">{rec.details?.brand || rec.title} — {rec.details?.model || rec.reference}</h3>
                                                <p className="recommended-card__estimate">Current Bid: {formatCurrency(rec.currentPrice || rec.expectedPrice)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div> */}

            </section>
        </>


    )
}

export default DetailedPage