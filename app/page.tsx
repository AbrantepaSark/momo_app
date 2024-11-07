"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formValidation } from "@/validation/formData";

import {
  Input,
  Select,
  SelectItem,
  Button,
  Spinner,
  Image,
} from "@nextui-org/react";
import { CustomModal } from "@/components/modal";

export default function Home() {
  const initialFormState = {
    senderNetwork: "",
    senderNumber: "",
    receiverNetwork: "",
    receiverNumber: "",
    amount: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(false);
  const [fetchError, setFetechError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [telcoList, setTelcoList] = useState([]);
  const [onFetchLoading, setOnFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [charges, setCharges] = useState(0);
  const [validationErrors, setValidationErrors]: any = useState([]);

  let amount = parseFloat(formData?.amount);

  //function to calculate E-levy
  const cal_Elevy = () => {
    if (amount > 100.0) {
      return 0.015 * amount;
    } else {
      return 0.0;
    }
  };

  //function to calculate charges on mtn
  const calMTNCharges = () => {
    if (amount <= 50.0) {
      return amount * 0.005;
    } else {
      return amount * 0.01;
    }
  };

  //function to calculate charges on telecel & AT
  //assuming same tarrifs
  function calTElATCharges() {
    if (amount <= 100.0) {
      return 0;
    } else if (amount > 100.0 && amount <= 1000.0) {
      return amount * 0.001;
    } else {
      return 5.0;
    }
  }

  //main charges function
  function calculateCharges() {
    let receiverNetwork = formData?.receiverNetwork;

    switch (formData?.senderNetwork) {
      case "0": {
        if (receiverNetwork == "0") {
          //sending from mtn to mtn
          let chargeResult = calMTNCharges();
          setCharges(chargeResult);
        } else {
          //sending from mtn to others
          setCharges(amount * 0.015);
        }
        break;
      }
      case "1": {
        if (receiverNetwork == "1") {
          //sending from telecel to telecel
          setCharges(0);
        } else {
          //sending from telecel to others
          let chargeResult = calTElATCharges();
          setCharges(chargeResult);
        }
        break;
      }
      case "2": {
        if (receiverNetwork == "2") {
          //sending from AT to AT
          //assuming same tarrif as telecel
          setCharges(0);
        } else {
          //sending from AT to others
          //assuming same tarrif as telecel
          let chargeResult = calTElATCharges();
          setCharges(chargeResult);
        }
        break;
      }
      default:
        console.log("Unknown input");
    }
  }

  //Handle form input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setFetechError(false);
  };

  //handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { error, value } = formValidation.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      let errorList = error.details.map((err: any) => err.context.key);
      console.log("errorlist", errorList);
      setValidationErrors(errorList);
      return;
    }
    setValidationErrors([]);
    setIsModalOpen(true);
    //calculate charges function
    calculateCharges();
  };

  //handle joining newsletter submission
  const handleJoinNewLetter = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://telcos-five.vercel.app/api/newsletter",
        { phoneNumber: formData?.senderNumber }
      );
      if (response.status == 200) {
        setJoined(true);
        setError(false);
        closeModal();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.log("error on posting data");
      setError(true);
      setLoading(false);
    }
  };

  //handle form reset
  const handleReset = () => {
    setFormData(initialFormState);
  };

  //Fetch telco data
  useEffect(() => {
    // Define the async function to fetch data
    const fetchData = async () => {
      try {
        setOnFetchLoading(true);
        const response = await axios.get(
          "https://telcos-five.vercel.app/api/telcos"
        );
        if (response.status == 200) {
          setTelcoList(response?.data);

          setFetechError(false);
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error: any) {
        setFetechError(true);
      } finally {
        setOnFetchLoading(false);
      }
    };

    fetchData(); // Call the function to make the request
  }, []); // Empty dependency array to run only once on mount

  if (onFetchLoading)
    return (
      <div className="flex flex-col gap-y-4">
        <Spinner size="lg" /> <p>Loading...</p>
      </div>
    );
  if (fetchError) return <p>Error encountered, try again later</p>;
  return (
    <>
      <section className="flex w-full flex-col items-center justify-center text-sm lg:text-base gap-4 py-8 md:py-10">
        <h3 className="text-2xl font-bold">MoMo Transaction</h3>
        <p className="text-sm mb-5 italic">Fill form below</p>
        <div className=" w-full flex item-center justify-center">
          <div className="lg:w-1/2 md:w-3/5 w-full mx-3 lg:p-5 p-2">
            <div>
              <form onSubmit={handleSubmit}>
                <p className="mb-2">Sender: </p>
                <div className="flex gap-x-2">
                  <div className="w-3/6 flex flex-col">
                    <Select
                      label="Network"
                      name="senderNetwork"
                      items={telcoList}
                      value={formData.senderNetwork}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          senderNetwork: e.target.value,
                        })
                      }
                      className="w-full"
                    >
                      {telcoList?.map((item: any, index: number) => (
                        <SelectItem key={index} textValue={item?.name}>
                          <div className="flex gap-x-2">
                            <Image
                              width={20}
                              height={20}
                              alt="logo"
                              src={item?.logo}
                            />
                            {item?.name}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    {validationErrors.includes("senderNetwork") && (
                      <small className="text-red-500 italic">
                        Select network
                      </small>
                    )}
                  </div>
                  <div className="w-full">
                    <Input
                      label="Number"
                      name="senderNumber"
                      value={formData.senderNumber}
                      onChange={handleChange}
                      placeholder="eg. 0543322668"
                    />
                    {validationErrors.includes("senderNumber") && (
                      <small className="text-red-500 italic">
                        Enter valid number
                      </small>
                    )}
                  </div>
                </div>
                <p className="mb-2 mt-6">Receipient: </p>
                <div className="flex gap-x-4">
                  <div className="w-3/6 flex flex-col">
                    <Select
                      label="Network"
                      name="receiverNetwork"
                      items={telcoList}
                      value={formData.receiverNetwork}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          receiverNetwork: e.target.value,
                        })
                      }
                      className="w-full"
                    >
                      {telcoList?.map((item: any, index: number) => (
                        <SelectItem key={index} textValue={item?.name}>
                          <div className="flex gap-x-2">
                            <Image
                              width={20}
                              height={20}
                              alt="logo"
                              src={item?.logo}
                            />
                            {item?.name}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    {validationErrors.includes("receiverNetwork") && (
                      <small className="text-red-500 italic">
                        Select network
                      </small>
                    )}
                  </div>
                  <div className="w-full">
                    <Input
                      label="Number"
                      name="receiverNumber"
                      className="w-full"
                      value={formData.receiverNumber}
                      onChange={handleChange}
                      placeholder="eg. 0543322668"
                    />
                    {validationErrors.includes("receiverNumber") && (
                      <small className="text-red-500 italic">
                        Enter valid number
                      </small>
                    )}
                  </div>
                </div>
                <p className="mb-2 mt-6"> Amount: </p>
                <div>
                  <Input
                    label="GHS"
                    name="amount"
                    value={formData.amount.toString()}
                    onChange={handleChange}
                    placeholder="eg. 100"
                  />
                  {validationErrors.includes("amount") && (
                    <small className="text-red-500 italic">
                      Enter valid amount
                    </small>
                  )}
                </div>
                <div className="flex gap-x-5 my-4 text-sm">
                  <p>
                    <span className="font-semibold">Charges: </span>
                    {charges.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">E-levy: </span>
                    {cal_Elevy().toFixed(2)}
                  </p>
                </div>
                {/*showErrorAlert ? (
                  <div
                    className="p-4 my-4 text-sm bg-red-200 rounded-lg"
                    role="alert"
                  >
                    <span className="font-medium">Alert!</span> Pass correct
                    numbers and amount
                  </div>
                ) : null */}
                <div className="flex my-8 gap-x-5">
                  <Button
                    type="reset"
                    onClick={handleReset}
                    className="h-12"
                    fullWidth
                    color="danger"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-12"
                    fullWidth
                    type="submit"
                    color="primary"
                  >
                    Calculate
                  </Button>
                </div>

                <p className="italic text-sm ">
                  {joined
                    ? "You have subscribed for newsletter"
                    : "You have not subscribed for newsletter"}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <CustomModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        joined={joined}
        error={error}
        handleJoinNewLetter={handleJoinNewLetter}
        loading={loading}
      />
    </>
  );
}
