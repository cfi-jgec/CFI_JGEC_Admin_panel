"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/Components/common/CommonLayout";
import {
    Button,
    FileInput,
    Label,
    Modal,
    TextInput,
} from "flowbite-react";
import InputField from "@/Components/common/InputField";
import { Form, Formik } from "formik";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";
import { deleteStorage, fileToUrlLink } from "@/utils/data";
import Loader from "@/Components/common/Loader";
import * as Yup from "yup";
import { useAppDispatch } from "@/redux/Store";
import { updateEvents } from "@/redux/slices/AdminSlice";
import { EventsItemsType } from "@/type";
import { Url } from "url";
import EventCard from "@/Components/eventComp/EventCard";
import toast from "react-hot-toast";
import ImageCropUpload from "@/Components/common/CroppedImage";

const Events = () => {
    const dispatch = useAppDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const [photo, setPhotoUrl] = useState<string>("");
    const [eventDetails, setEventDetails] = useState<EventsItemsType>({
        shortName: "",
        fullName: "",
        description: "",
        date: "",
        type: "",
        organizer: "",
    });
    const [eventList, setEventList] = useState<EventsItemsType[]>([]);

    const validate = Yup.object({
        shortName: Yup.string()
            .max(20, "Short name must contain at max 20 characters")
            .required("short name is required"),
        fullName: Yup.string().required("full name is required"),
        description: Yup.string()
            .min(100, "description must contain at list 100 characters")
            .required("description is required"),
        date: Yup.string().required("date is required"),
        type: Yup.string().required("type is required"),
        organizer: Yup.string().required("organizer is required"),
    });

    const getPhotoUrl = (url: string) => {
        setPhotoUrl(url);
    }

    // // upload the photo into firebase storage
    // const uploadPhoto = async (e: any) => {
    //     const imgFile = e.target.files[0];
    //     if (imgFile) {
    //         const imgUrl = await fileToUrlLink(imgFile, `Event/`);
    //         if (imgUrl) {
    //             setPhotoUrl(imgUrl);
    //             toast.success("photo Upload");
    //         }
    //         else toast.error("photo not Upload");
    //     }
    // };

    // reset values
    const resetData = () => {
        setEventDetails({
            shortName: "",
            fullName: "",
            description: "",
            date: "",
            type: "",
            organizer: "",
        });
        setOpenModal(false);
        setIsUpdate(false);
    };

    // update values
    const openUpdate = async (value: EventsItemsType) => {
        setIsUpdate(true);
        const { shortName, fullName, description, date, type, organizer, photo } =
            value;
        setEventDetails({
            shortName,
            fullName,
            description,
            date,
            type,
            organizer,
        });
        if (photo) setPhotoUrl(String(photo));
        setOpenModal(true);
    };

    // get all alumni details
    const getAllEvents = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/events");
            setEventList(data.events);
            dispatch(updateEvents(data.events));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // add alumni details
    const addEvents = async (values: EventsItemsType) => {
        if (!photo) {
            toast.error("please upload photo");
            return;
        }
        try {
            setLoading(true);
            values.photo = photo;
            const { data } = await axios.post("/api/events/add", values);
            getAllEvents();
            resetData();
            toast.success(data.message)
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };

    // update alumni details
    const updateEvent = async (values: EventsItemsType) => {
        try {
            setLoading(true);
            values.photo = photo;
           const {data}= await axios.post("/api/events/update", values);
            getAllEvents();
            resetData();
            toast.success(data.message)
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };

    // delete alumni details
    const deleteEvent = async (item: EventsItemsType) => {
        try {
            setLoading(true);
            await axios.post(`/api/events/remove`, item);
            if(item.photo)await deleteStorage(item.photo);
            getAllEvents();
            toast.success("event deleted successfully")
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllEvents();
    }, []);

    if (loading) return <Loader />;

    return (
        <Layout header={"events"}>
            <div className="mb-4 mt-2 flex justify-between items-center">
                <div className="w-[20rem]">
                    <TextInput
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search by name"
                        icon={FaMagnifyingGlass}
                        className=" outline-none"
                    />
                </div>
                <div
                    className="button"
                    color="light"
                    onClick={() => setOpenModal(true)}
                >
                    Add New
                </div>
            </div>
            <Modal
                show={openModal}
                size={"lg"}
                popup
                onClose={resetData}
            >
                <Modal.Header className="ps-6">Add New Event</Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={eventDetails}
                        validationSchema={validate}
                        onSubmit={(values) =>
                            isUpdate ? updateEvent(values) : addEvents(values)
                        }
                    >
                        {({ handleChange }) => (
                            <Form>
                                <InputField
                                    name="shortName"
                                    placeholder="Event short name"
                                    label={"Event short name"}
                                />
                                <InputField
                                    name="fullName"
                                    placeholder="Event Full name"
                                    label={"Event Full name"}
                                />
                                <InputField
                                    isInput={false}
                                    name="description"
                                    placeholder="Event description"
                                    label={"Event description"}
                                />
                                <div className="mb-2">
                                    <div className="mb-1 block">
                                        <Label htmlFor="photo" value="Upload Event photo" />
                                    </div>
                                    <ImageCropUpload onUploadComplete={getPhotoUrl} aspect={16 / 9} fileType="Event/" /> 
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="w-[45%]">
                                        <div className="mb-1 block">
                                            <Label htmlFor="date" value="Select date" />
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            onChange={handleChange}
                                            className="rounded-lg w-full"
                                        />
                                    </div>
                                    <div className="w-[45%]">
                                        <InputField
                                            name="type"
                                            placeholder="Event type"
                                            label={"Event type"}
                                        />
                                    </div>
                                </div>
                                <InputField
                                    name="organizer"
                                    placeholder="Event organizer"
                                    label={"Event organizer"}
                                />
                                <div className="flex gap-4 my-3">
                                    {isUpdate ? (
                                        <Button disabled={photo === ""} color={"info"} type="submit">
                                            Update Event
                                        </Button>
                                    ) : (
                                        <>
                                            <Button disabled={photo === ""} color={"success"} type="submit">
                                                Add Event
                                            </Button>
                                            <Button color={"failure"} type="reset">
                                                Reset
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>

            {eventList && eventList.length > 0 ? (
                <div className="grid grid-cols-3 gap-8">
                    {eventList
                        .filter((ele) =>
                            ele.shortName.toLowerCase().includes(searchVal.toLowerCase())
                        )
                        .map((item, i) => {
                            return (
                                <EventCard
                                    key={i}
                                    props={item}
                                    updateEvent={(e: EventsItemsType) => openUpdate(e)}
                                    deleteEvent={(e: EventsItemsType) => deleteEvent(e)}
                                />
                            );
                        })}
                </div>
            ) : (
                <h1 className="not_found">Sorry no data found</h1>
            )}
        </Layout>
    );
};

export default Events;

