import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import RandomQueries from "../../components/IconsHolder/RandomQueries/RandomQueries";
import CustomChatbotComponent from "../Mini_Chatbot/CustomChatbotComponent";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Shimmer from "./Shimmer"; // Import the Shimmer component
import {
  IconButton,
  Drawer,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";

import Typography from "@mui/material/Typography";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ScreenSearchDesktop as ScreenSearchDesktopIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import axios from "axios";

import Markdown from "react-markdown";

import infobellImg from "../../assets/Images/infobellLogo.png";
import newchat from "../../assets/Images/icons8-chat-64.png";
import openaiimg from "../../assets/Images/openai-logo-0.png";
import styles from "./Home.module.css";

import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";

import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";

const sdk = require("microsoft-cognitiveservices-speech-sdk");
// const fs = require('fs').promises;
const SPEECH_KEY = "f4a8f5be7801494fa47bc87d6d8ca31d";
const SPEECH_REGION = "eastus";
const speechConfig = sdk.SpeechConfig.fromSubscription(
  SPEECH_KEY,
  SPEECH_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";
speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural";
//Key1 : 334e16bf5eb643a6b8ebd8f0e61bf937u0i
//Key2 : 8bcb5f3956be4afdbbbc3c3b937fa437
//Region : eastus
//Endpoint : https://eastus.api.cognitive.microsoft.com/

const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState("");

  const [widthM, setWidthM] = useState("100%");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("jira");
  // const [isResponseComplete, setIsResponseComplete] = useState(false); // Track response completion
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const queryRef = useRef(null);

  // const { profile } = location.state || {};
  const [logout, setLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  let [answerFlag1, setAnswerFlag1] = useState(true);
  let [answerFlag2, setAnswerFlag2] = useState(true);
  let [answerFlag3, setAnswerFlag3] = useState(true);
  const [selectedFile, setSelectedFile] = useState();

  const handleOpenChatbot = () => setIsChatbotOpen(true);
  const handleCloseChatbot = () => setIsChatbotOpen(false);

  const [document, setDocument] = useState(false);
  const [link, setLink] = useState(false);
  const [maxTokens, setMaxTokens] = useState(100); // Default value
  const [temperature, setTemperature] = useState(0.5);
  const [topk, setTopk] = useState(2);
  const depthRef = useRef(null);
  const linkref = useRef("");
  const llm_endpoint_ref = useRef("");
  const embeddingRef = useRef("");
  const indexref = useRef("");

  const dimensionsRef = useRef("");
  const metricRef = useState("");
  const [monitoring, setMonitoring] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");

  const [isCollapse5, setIsCollapse5] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [index, setIndex] = useState(false);
  const [config, setConfig] = useState(false);
  const [llm_endpoint, setLlm_endpoint] = useState("");
  const [indexes, setIndexes] = useState();
  const [files, setFiles] = useState();
  const [selectedIndex, setSelectedIndex] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const today = new Date();

  const date_for_file = today.toISOString().split("T")[0];

  const handleCollapse5 = async () => {
    const response = await axios.get(
      // "http://192.168.0.182:8088/list_files"
      "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/list_files"
    );
    // const response = await axios.get("http://127.0.0.1:5000/list_files");
    console.log(response.data);
    setFiles(response.data);
    setIsCollapse5(!isCollapse5);
  };

  const transformData = (rawData) => {
    let transformedData = [];
    rawData.forEach((item) => {
      const userMessage = { answer: item.Query, sender: "user" };
      const botMessage = { sender: "bot", display: 1, answer: item.Response };
      transformedData.push(userMessage, botMessage);
    });
    return transformedData;
  };

  const get_file = async (event) => {
    const selectedFile = event.target.value;
    setSelectedIndex(selectedFile); // Update the selected index
    setMessages([]);
    console.log("get_file_single");
    console.log("this is file name" + selectedFile);
    // const response = await axios.post("http://127.0.0.1:5000/one_file", {
    const response = await axios.post(
      // "http://192.168.0.182:8088/one_file",
      "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/one_file",
      {
        file: selectedFile,
      }
    );
    console.log(typeof response);
    console.log(response.data);
    const transformedMessages = transformData(response.data);
    setMessages(transformedMessages);
    setIsOpen(false);
  };

  useEffect(() => {
    if (messages) {
      console.log(messages);
    }
  }, [messages]);

  // useEffect(() => {
  //   const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  //   const speechConfig = sdk.SpeechConfig.fromSubscription(
  //     "f4a8f5be7801494fa47bc87d6d8ca31d", // Replace with your key
  //     "eastus"
  //   ); // Replace with your actual key and region

  //   // Create the recognizer
  //   const speechRecognizer = new sdk.SpeechRecognizer(
  //     speechConfig,
  //     audioConfig
  //   );
  //   setRecognizer(speechRecognizer);

  //   return () => {
  //     if (speechRecognizer) {
  //       speechRecognizer.close();
  //     }
  //   };
  // }, []);

  // const correctSpecialWords = (text) => {
  //   return text
  //     .split(" ")
  //     .map((word) => {
  //       switch (word.toLowerCase()) {
  //         case "amd epic":
  //           return "AMD EPYC";
  //         case "amd risen":
  //           return "AMD RYZEN";
  //         case "processes":
  //           return "processors";
  //         case "epic":
  //           return "EPYC";
  //         case "risen":
  //         case "horizon":
  //         case "rise and":
  //           return "RYZEN";
  //         case "amd":
  //         case "md":
  //         case "mda":
  //           return "AMD";
  //         default:
  //           return word;
  //       }
  //     })
  //     .join(" ");
  // };

  // const startListening = async () => {
  //   if (recognizer) {
  //     setIsListening(true);

  //     recognizer.startContinuousRecognitionAsync(
  //       () => {
  //         console.log("Continuous recognition started");
  //       },
  //       (error) => {
  //         console.error("Error starting continuous recognition:", error);
  //         setIsListening(false);
  //       }
  //     );

  //     let previousWords = [];
  //     let currentSearchValue = "";

  //     recognizer.recognizing = (s, e) => {
  //       if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
  //         const currentWords = e.result.text.split(" ");
  //         const newWords = currentWords.filter(
  //           (word) => !previousWords.includes(word)
  //         );

  //         if (newWords.length > 0) {
  //           const interimText = correctSpecialWords(newWords.join(" "));
  //           currentSearchValue = (
  //             currentSearchValue +
  //             " " +
  //             interimText
  //           ).trim();

  //           console.log("New words:", interimText);
  //           console.log("Updated Search Value:", currentSearchValue);

  //           setSearchValue(currentSearchValue);
  //           previousWords = currentWords;
  //         }
  //       }
  //     };
  //   }
  // };

  // const stopListening = () => {
  //   if (recognizer) {
  //     recognizer.stopContinuousRecognitionAsync(
  //       () => {
  //         console.log("Continuous recognition stopped");
  //         setIsListening(false);
  //       },
  //       (error) => {
  //         console.error("Error stopping continuous recognition:", error);
  //       }
  //     );
  //   }
  // };

  useEffect(() => {
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      "f4a8f5be7801494fa47bc87d6d8ca31d",
      "eastus"
    );

    // Create the recognizer
    const speechRecognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    setRecognizer(speechRecognizer);

    return () => {
      if (speechRecognizer) {
        speechRecognizer.close();
      }
    };
  }, []);

  const correctSpecialWords = (text) => {
    return text
      .split(" ")
      .map((word) => {
        switch (word.toLowerCase()) {
          case "amd epic":
            return "AMD EPYC";
          case "amd risen":
            return "AMD RYZEN";
          case "processes":
            return "processors";
          case "epic":
          case "pick":
            return "EPYC";
          case "risen":
          case "horizon":
          case "rise and":
            return "RYZEN";
          case "amd":
          case "md":
          case "mda":
            return "AMD";
          default:
            return word;
        }
      })
      .join(" ");
  };

  const startListening = async () => {
    if (recognizer) {
      setIsListening(true);

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("Continuous recognition started");
        },
        (error) => {
          console.error("Error starting continuous recognition:", error);
          setIsListening(false);
        }
      );

      let previousWords = [];
      let currentSearchValue = "";

      recognizer.recognizing = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
          const currentWords = e.result.text.split(" ");
          const newWords = currentWords.filter(
            (word) => !previousWords.includes(word)
          );

          if (newWords.length > 0) {
            const interimText = correctSpecialWords(newWords.join(" "));
            currentSearchValue = (
              currentSearchValue +
              " " +
              interimText
            ).trim();

            console.log("Interim words:", interimText);
            console.log("Updated Search Value:", currentSearchValue);

            setSearchValue(currentSearchValue);
            previousWords = [...previousWords, ...newWords];
          }
        }
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          setTranscription((prevTranscription) => {
            // Correct the recognized text
            const correctedText = correctSpecialWords(e.result.text);
            const newTranscription = prevTranscription + " " + correctedText;

            console.log("RECOGNIZED:", e.result.text);
            console.log("Corrected Text:", correctedText);
            console.log("New Transcription:", newTranscription);

            setSearchValue(newTranscription);
            return newTranscription;
          });
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          console.log("NOMATCH: Speech could not be recognized.");
        }
      };
    }
  };

  const stopListening = () => {
    setTranscription("");
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log("Continuous recognition stopped");
          setIsListening(false);
        },
        (error) => {
          console.error("Error stopping continuous recognition:", error);
        }
      );
    }
  };

  const handleRelatedQuestionClick = (question) => {
    setSearchValue(question);
    queryRef.current.focus();
  };

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const drawerWidth = 240;

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const getAnswer = async () => {
    const query = searchValue.trim();
    if (!query) {
      // If searchValue is empty, do not proceed
      return;
    }

    setSearchValue("");
    setTranscription("");
    stopListening();

    const userMessage = { answer: query, sender: "user" };
    const botMessage = {
      sender: "bot",
      display: 0,
      answer: "",
      isProcessing: true,
    };
    setMessages([...messages, userMessage, botMessage]);
    setIsOpen(false);

    if (query) {
      try {
        const response = await fetch(
          // "https://d5a0-45-112-53-218.ngrok-free.app/rag_qa_api_stream",
          "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/rag_qa_api_stream",
          // "http://192.168.0.182:8088/rag_qa_api_stream",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: searchValue }),
          }
        );

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let responseText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          responseText += chunk;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].answer += chunk;
            newMessages[newMessages.length - 1].isProcessing = false;
            return newMessages;
          });
        }
      
        // setMessages((prevMessages) => [...prevMessages, related_questions_message]);
        const relatedQuestionsResponse = await fetch(
          // "https://d5a0-45-112-53-218.ngrok-free.app/related_questions",
          // "http://192.168.0.182:8088/related_questions",
          "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/related_questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: query, answer: responseText }),
          }
        );

        const relatedQuestionsData = await relatedQuestionsResponse.json();
        const newRelatedQuestions =
          relatedQuestionsData.related_questions || [];

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.push({
            sender: "bot_rq",
            answer: JSON.stringify(newRelatedQuestions),
          });
          return newMessages;
        });

        console.log("Related Questions:", relatedQuestions); // Log related questions

        setTranscription("");
      } catch (error) {
        console.error("Error in llm:", error);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        getAnswer();
      }
    };

    const inputElement = queryRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleKeyPress);
      }
    };
  });

  const monitor = () => {
    navigate("/monitor");
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  console.log(messages);

  useEffect(() => {
    scrollToBottom();
  }, [messages, answers]);


return (
  <>
    <div
      className="scroll-Container"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "white",
        padding: 10,
        overflow: "auto", // Hide the scrollbar
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "10%",
        }}
      >
        <div style={{ width: "2%" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          {/* sidebar */}

          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <div>
              <DrawerHeader
                style={{
                  minHeight: "60px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip title="Create new chat">
                  <img
                    src={newchat}
                    alt="Create new chat"
                    style={{
                      cursor: "pointer",
                      height: "24px",
                      width: "24px",
                    }}
                    onClick={() => {
                      window.location.reload();
                    }}
                  />
                </Tooltip>
                <IconButton
                  onClick={() => {
                    setOpen(false, () => {});
                  }}
                >
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                <ListItem
                  disablePadding
                  onClick={() => handleCollapse5}
                  sx={{ marginBottom: "8px" }}
                >
                  <ListItemButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "#CDF5FD",
                      },
                      backgroundColor:
                        selectedItem === "history" ? "#CDF5FD" : "transparent",
                    }}
                    onClick={() => {
                      handleCollapse5();
                      setSelectedItem("history");
                    }}
                  >
                    <ListItemIcon
                      style={{ minWidth: "20px", marginRight: "8px" }}
                    >
                      <WidgetsOutlinedIcon
                        sx={{ fontSize: 20, color: "#00A9FF" }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="History" />
                    {isCollapse5 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isCollapse5} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 4 }}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="index"
                        name="index"
                        value={selectedIndex}
                        onChange={get_file}
                      >
                        {files &&
                          files.map((file) => (
                            <Box
                              key={file}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#CDF5FD",
                                },
                                backgroundColor:
                                  selectedIndex === file
                                    ? "#CDF5FD"
                                    : "transparent",
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={() =>
                                get_file({ target: { value: file } })
                              }
                            >
                              <FormControlLabel
                                value={file}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      color: "#071952",
                                      "&.Mui-checked": {
                                        color: "#071952",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <span className="radio-label">
                                    {file.charAt(0).toUpperCase() +
                                      file.slice(1)}
                                  </span>
                                }
                                sx={{
                                  flex: 1,
                                  margin: 0,
                                }}
                              />
                            </Box>
                          ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Collapse>
              </List>

              <List></List>
              <List>
                <ListItem disablePadding sx={{ marginBottom: "8px" }}>
                  <ListItemButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "#CDF5FD", // Change background color on hover
                      },
                      backgroundColor:
                        selectedItem === "uploadDoc"
                          ? "#CDF5FD"
                          : "transparent",
                    }}
                    onClick={() => {
                      setMonitoring(true);
                      monitor();
                    }}
                  >
                    <ListItemIcon
                      style={{ minWidth: "20px", marginRight: "8px" }}
                    >
                      <ScreenSearchDesktopIcon
                        sx={{ fontSize: 20, color: "#00A9FF" }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Monitoring" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
            </div>
          </Drawer>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: open ? "calc(100% - 210px)" : "98%", // Adjust width based on sidebar state
            justifyContent: "space-between",
            marginLeft: open ? "210px" : "0", // Shift the logo when sidebar is open
            transition: "width 0.3s, margin-left 0.3s", // Smooth transition
          }}
        >
          <img
            alt=""
            src={infobellImg}
            style={{
              height: "3rem",
              transition: "transform 0.3s",
              
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "10px",
          justifyContent: "space-around",
          height: "calc(100% - 70px)", // Adjust height to account for the fixed prompt bar
          overflow: "auto", // Enable scrolling for the chat section
        }}
        className="scroll-Container"
      >
        {isOpen ? (
          <div
            style={{
              width: "40%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <RandomQueries onQuerySelect={(query) => setSearchValue(query)} />
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
                height: "100%",
                width: "50%",
              }}
            >
              <div
                ref={messagesEndRef}
                className="scroll-Container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  paddingBottom: "70px", // Add padding to avoid overlapping with the prompt bar
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {/* <h4>Which response do you prefer?</h4>
                    <p style={{ color: "lightgray" }}>
                      Your choice will make ConvoGene better{" "}
                    </p> */}
                </div>
                {messages?.map((message, index) => (
                  <div
                    key={index}
                    className="scroll-container"
                    style={{
                      display: "flex",
                      justifyContent:
                        message?.sender === "user" ? "flex-end" : "flex-start",
                      flexDirection: message?.sender === "user" ? "" : "column",
                    }}
                  >
                    {message?.sender === "user" && (
                      <>
                        <p
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "8px",
                            backgroundColor:
                              message?.sender === "user"
                                ? "#cccccc7d"
                                : "unset",
                            width: "fit-content",
                          }}
                        >
                          {message.answer}
                        </p>
                      </>
                    )}
                    {message?.sender === "bot" && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            textAlign: "left",
                            justifyContent: "flex-start",
                            flexDirection: "column",
                            overflowWrap: "break-word",
                          }}
                        >
                          {message?.isProcessing && <Shimmer />}
                          {message?.answer &&
                            [0, 1].indexOf(message?.display) > -1 && (
                              <div
                                onClick={() => {
                                  setMessages((prev) => {
                                    let values = [...prev];
                                    values[index]["display"] = 1;
                                    return values;
                                  });
                                }}
                                className={styles.robotmessageContainer}
                                style={{
                                  width:
                                    message.display !== 0 ? "100%" : widthM,
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <img
                                    alt=""
                                    src={openaiimg}
                                    style={{ width: "50px", height: "17px" }}
                                  />
                                  <p style={{ fontSize: "12px" }}>-GPT4</p>{" "}
                                </span>
                                <Markdown
                                  components={{
                                    a: ({ node, ...props }) => (
                                      <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      />
                                    ),
                                  }}
                                >
                                  {message.answer}
                                </Markdown>
                              </div>
                            )}
                        </div>
                      </>
                    )}
                    {message?.sender === "bot_rq" && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            paddingBottom: "50px",
                            textAlign: "left",
                            justifyContent: "flex-start",
                            flexDirection: "column",
                          }}
                        >
                          {message.answer &&
                            JSON.parse(message.answer).length > 0 && (
                              <div className="related-questions">
                                <Typography variant="h6">
                                  Related Questions:
                                </Typography>
                                {JSON.parse(message.answer).map(
                                  (question, qIndex) => (
                                    <Card
                                      key={qIndex}
                                      onClick={() =>
                                        handleRelatedQuestionClick(question)
                                      }
                                      className="related-question-card"
                                      style={{
                                        border: "1px solid #ccc",
                                        outline: "1px solid #ccc",
                                        marginBottom: "5px",
                                        width: "100%", // Adjust width
                                        minHeight: "40px", // Adjust height
                                        transition: "background-color 0.3s", // Smooth transition for background color
                                        fontSize: "12pt", // Adjust font size
                                      }} // Add border and margin
                                    >
                                      <CardContent
                                        style={{
                                          paddingTop: "2px",
                                          paddingBottom: "2px",
                                        }}
                                      >
                                        <Box
                                          display="flex"
                                          justifyContent="space-between"
                                          alignItems="center"
                                        >
                                          <Typography variant="body1">
                                            {question}
                                          </Typography>
                                          <IconButton>
                                            <AddIcon />
                                          </IconButton>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "#ffff",
          padding: "10px",
          // boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          height: "70px", // Adjust height as needed
        }}
      >
        <div
          style={{
            width: "50%",
            border: "2px solid #ccc",
            borderRadius: 50,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative", // Add relative positioning
          }}
        >
          <Button
            style={{
              color: isListening ? "red" : "black",
              position: "absolute",
              left: "0px", // Position the mic icon inside the input field
              zIndex: 1, // Ensure the button is above the input field
            }}
            onClick={isListening ? stopListening : startListening}
          >
            <KeyboardVoiceIcon className="micIcon" />
          </Button>
          <input
            ref={queryRef}
            className="searchInput"
            placeholder="Enter the prompt"
            value={searchValue}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") getAnswer();
            }}
            style={{
              flex: 1,
              padding: "10px 40px", // Add padding to make space for icons
              paddingLeft: "60px", // Add padding to the left to make space for the mic icon
              border: "none",
              outline: "none",
              borderRadius: "50px",
            }}
          />
          <Button
            style={{
              color: "black",
              position: "absolute",
              right: "0px", // Position the send icon inside the input field
              zIndex: 1, // Ensure the button is above the input field
            }}
            onClick={getAnswer}
          >
            <SendIcon className="sendIcon" />
          </Button>
        </div>

        <CustomChatbotComponent />
      </div>
    </div>
  </>
);
};

export default Home;
