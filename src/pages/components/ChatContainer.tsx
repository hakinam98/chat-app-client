import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import { Message, User } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

interface ChatContainerProps {
  currentChat: any;
  currentUser: User | undefined;
  socket: any;
}
