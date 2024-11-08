import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import RandomQueries from "../../components/IconsHolder/RandomQueries/RandomQueries";
import CustomChatbotComponent from "../Mini_Chatbot/CustomChatbotComponent";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import micActiveLogo from "../../assets/Images/stop-button.png";
import remarkGfm from "remark-gfm";
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
  const [open, setOpen] = useState(true);
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
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [index, setIndex] = useState(false);
  const [config, setConfig] = useState(false);
  const [llm_endpoint, setLlm_endpoint] = useState("");
  const [indexes, setIndexes] = useState();
  const [files, setFiles] = useState();
  const [selectedIndex, setSelectedIndex] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [selectedChatHistory, setSelectedChatHistory] = useState("");

  const today = new Date();

  const date_for_file = today.toISOString().split("T")[0];

  const handleCollapse5 = async () => {
    setLoadingChatHistory(true);
    const response = await axios.get(
      "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/list_files"
    );
    console.log(response.data);
    setFiles(response.data);
    setIsCollapse5(true);
    setLoadingChatHistory(false);
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
    setSelectedIndex(selectedFile);
    setMessages([]);
    console.log("get_file_single");
    console.log("this is file name" + selectedFile);
    const response = await axios.post(
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

  // useEffect(() => {
  //   axios
  //     .get(
  //       "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/home"
  //     )
  //     .then((response) => {
  //       console.log("Backend server woke up:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error waking up backend server:", error);
  //     });
  // }, []);

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

  const drawerWidth = 280;

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const getAnswer = async (temp) => {
    setIsNewChat(false);
    const query = temp || searchValue.trim();
    if (!query) {
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
          "https://convogene-rag-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/rag_qa_api_stream",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: query }),
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
          const currentResponseText = responseText;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].answer = currentResponseText;
            newMessages[newMessages.length - 1].isProcessing = false;
            return newMessages;
          });
        }

        const relatedQuestionsResponse = await fetch(
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

  function handleResize() {
    if (window.innerWidth < 800) {
      setOpen(false);
      setIsLargeScreen(false);
    } else {
      setOpen(true);
      setIsLargeScreen(true);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, answers]);

  return (
    <>
      <div
        className="scroll-Container"
        style={{
          display: "flex",
          gap: "20px",
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
          padding: 10,
          position: "relative",
          backgroundImage: "url('./bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflowY: "hidden",
        }}
      >
        {/* sidebar */}

        {open && (
          <div
            style={{
              width: isLargeScreen ? "40%" : "100%",
              maxWidth: drawerWidth,
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(42px)",
              borderRadius: "26px",
              padding: "15px",
              overflow: "auto",
              position: isLargeScreen ? "relative" : "fixed",
              top: 0,
              left: 0,
              zIndex: 1000,
            }}
            className="hide-scrollbar"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <img
                src="./infobell-large.png"
                alt="Create new chat"
                style={{
                  cursor: "pointer",
                  height: "40px",
                }}
              />
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
                style={{
                  aspectRatio: "1",
                }}
              >
                <img src="./burger.svg" alt="burger" />
              </IconButton>
            </div>
            <button
              className="btn"
              style={{
                backgroundColor: "#5391F6",
                color: "white",
                borderRadius: "100px",
                padding: "10px 15px",
                fontWeight: "600",
                textAlign: "center",
                fontSize: "14px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
              onClick={() => {
                window.location.reload();
              }}
            >
              + New Chat
            </button>
            <List>
              <ListItem disablePadding sx={{ marginBottom: "8px" }}>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#C7E1FE8A", // Change background color on hover
                    },
                    backgroundColor:
                      selectedItem === "uploadDoc"
                        ? "#C7E1FE8A"
                        : "transparent",
                    borderRadius: "10px",
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
            <List>
              <ListItem disablePadding sx={{ marginBottom: "8px" }}>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#C7E1FE8A",
                    },
                    backgroundColor:
                      selectedItem === "history" ? "#C7E1FE8A" : "transparent",
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    if (isCollapse5) setIsCollapse5(false);
                    else handleCollapse5();
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
              {loadingChatHistory && <p>Loading...</p>}
              <Collapse
                in={isCollapse5}
                timeout="auto"
                unmountOnExit
                sx={{
                  padding: "10px",
                }}
              >
                {files &&
                  files.map((file) => (
                    <p
                      onClick={() => {
                        setIsNewChat(false);
                        setSelectedChatHistory(file);
                        get_file({ target: { value: file } });
                      }}
                      className={`chat-history-card ${
                        selectedChatHistory === file ? "active" : ""
                      }`}
                    >
                      {file.charAt(0).toUpperCase() + file.slice(1)}
                    </p>
                  ))}
              </Collapse>
            </List>
          </div>
        )}

        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: "10px",
            justifyContent: "space-around",
            overflow: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(42px)",
            borderRadius: "26px",
          }}
          className="scroll-Container"
        >
          {!open && (
            <IconButton
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
              }}
              onClick={handleDrawerOpen}
            >
              <img src="./burger.svg" alt="burger" />
            </IconButton>
          )}
          <div
            style={{
              position: "absolute",
              width: "60px",
              aspectRatio: "1",
              top: "20px",
              right: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "700",
              lineHeight: "21.78px",
              textAlign: "justified",
              backgroundColor: "#e5e5e5",
              borderRadius: "50%",
            }}
          >
            <p style={{
              margin: "0",
            }}>AMD</p>
          </div>

          {isNewChat ? (
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  Hey,{" "}
                  <i>
                    Welcome to{" "}
                    <span
                      style={{
                        color: "#387FF2",
                      }}
                    >
                      ConvoGene
                    </span>{" "}
                  </i>
                </p>
                <p
                  style={{
                    fontSize: "39px",
                    fontWeight: "700",
                    lineHeight: "47.2px",
                  }}
                >
                  How Can I Help?
                </p>
              </div>
              {/* Search bar */}
              <div
                style={{
                  width: "65%",
                  borderRadius: 50,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  padding: "10px",
                }}
              >
                <Button
                  style={{
                    color: isListening ? "red" : "#5391F6",
                    zIndex: 1,
                    aspectRatio: "1",
                    borderRadius: "50px",
                  }}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? (
                    <img
                      src={micActiveLogo}
                      alt="Mic Active"
                      style={{ height: "24px" }}
                    />
                  ) : (
                    <KeyboardVoiceIcon className="micIcon" />
                  )}
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
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    padding: "10px 5px",
                  }}
                />
                <Button
                  style={{
                    color: "#5391F6",
                    aspectRatio: "1",
                    borderRadius: "50px",
                  }}
                  onClick={() => {
                    getAnswer();
                  }}
                >
                  <SendIcon className="sendIcon" />
                </Button>
              </div>
              <RandomQueries onQuerySelect={(query) => getAnswer(query)} />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "10px",
                  height: "100%",
                  width: "70%",
                }}
              >
                <div
                  ref={messagesEndRef}
                  className="scroll-Container hide-scrollbar"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    paddingBottom: "70px", // Add padding to avoid overlapping with the prompt bar
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  {messages?.map((message, index) => (
                    <div
                      key={index}
                      className="scroll-container"
                      style={{
                        display: "flex",
                        justifyContent:
                          message?.sender === "user"
                            ? "flex-end"
                            : "flex-start",
                        flexDirection:
                          message?.sender === "user" ? "" : "column",
                      }}
                    >
                      {message?.sender === "user" && (
                        <p
                          style={{
                            padding: "10px 24px",
                            borderRadius: "8px",
                            backgroundColor:
                              message?.sender === "user"
                                ? "#C7E1FE8A"
                                : "unset",
                            width: "fit-content",
                            borderRadius: "20px",
                          }}
                          className="wrap-text"
                        >
                          {message.answer}
                        </p>
                      )}
                      {message?.sender === "bot" && (
                        <div
                          style={{
                            display: "flex",
                            textAlign: "left",
                            justifyContent: "flex-start",
                            justifyItems: "start",
                            gap: "16px",
                            padding: "30px 0",
                          }}
                          className="wrap-text"
                        >
                          {message?.answer && (
                            <div>
                              <img alt="" src="./star.svg" />
                            </div>
                          )}
                          {message?.isProcessing && <Shimmer />}
                          {message?.answer && (
                            <div
                              onClick={() => {
                                setMessages((prev) => {
                                  let values = [...prev];
                                  values[index]["display"] = 1;
                                  return values;
                                });
                              }}
                              style={{
                                width: message.display !== 0 ? "100%" : widthM,
                              }}
                            >
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
                                          boxShadow: "none",
                                          marginBottom: "5px",
                                          width: "100%",
                                          minHeight: "40px",
                                          fontSize: "12px",
                                          padding: "10px 5px",
                                          backgroundColor:
                                            "rgba(255, 255, 255, 0.4)",
                                          borderRadius: "20px",
                                        }}
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
          {/* Search bar */}
          {!isNewChat && (
            <div
              style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                padding: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: "70px",
              }}
            >
              <div
                style={{
                  width: "70%",
                  borderRadius: 50,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  padding: "10px",
                }}
              >
                <Button
                  style={{
                    color: isListening ? "red" : "#5391F6",
                    zIndex: 1,
                    aspectRatio: "1",
                    borderRadius: "50px",
                    height: "36px",
                  }}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? (
                    <img
                      src={micActiveLogo}
                      alt="Mic Active"
                      style={{ height: "24px" }}
                    />
                  ) : (
                    <KeyboardVoiceIcon className="micIcon" />
                  )}
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
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    padding: "10px 5px",
                  }}
                />
                <Button
                  style={{
                    color: "#5391F6",
                    aspectRatio: "1",
                    borderRadius: "50px",
                    height: "36px",
                  }}
                  onClick={() => {
                    getAnswer();
                  }}
                >
                  <SendIcon className="sendIcon" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
