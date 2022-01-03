import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState, useEffect } from "react";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { OpenInFull, Upload, OpenInBrowser } from "@mui/icons-material";

const markdownPath = "defaultMarkdown.md"; // relative to public folder

// Gutter
const Gutter = styled("div")({
  "&:hover": {
    cursor: "col-resize",
    backgroundColor: "rgba(255,255,255,.1)",
  },
});

//Editor
const Editor = styled("textarea")(({ theme }) => ({
  resize: "none",
  width: "100%",
  height: "100%",
  border: `1px solid transparent`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "transparent",
  padding: theme.spacing(2),
  color: theme.palette.grey["400"],
  "&:focus": {
    outline: "0",
    border: `1px solid ${theme.palette.grey["800"]}`,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: theme.palette.text.primary,
  },
}));

function MDPreviewer() {
  // Handling Resize

  const [editorFS, setEditorFS] = useState(false);
  const [previewerFS, setPreviewerFS] = useState(false);

  const calculateLeftPane = (windowInnerWidth) => {
    const padding = 24;
    const percent = 0.4;
    return (windowInnerWidth - padding * 2) * percent;
  };

  const calculateRightPane = (windowInnerWidth, leftPaneWidth) => {
    const padding = 24;
    const gutterWidth = 10;
    return windowInnerWidth - leftPaneWidth - gutterWidth - padding * 2;
  };

  const [dimensions, setDimensions] = useState({
    window: window.innerWidth,
    leftPane: calculateLeftPane(window.innerWidth),
    rightPane: calculateRightPane(
      window.innerWidth,
      calculateLeftPane(window.innerWidth)
    ),
  });

  // Handling Markdown

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(markdownPath)
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(text);
      });
  }, []);

  const handleChange = (e) => {
    setMarkdown(e.target.value);
  };

  const handleResize = (e) => {
    e.preventDefault();
    let prevX = e.clientX;

    const mousemove = (e) => {
      let newX = prevX - e.clientX;
      setDimensions({
        window: dimensions["window"],
        leftPane: dimensions["leftPane"] - newX,
        rightPane: calculateRightPane(
          window.innerWidth,
          dimensions["leftPane"] - newX
        ),
      });
    };

    const mouseup = () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    };

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  };

  return (
    <Container maxWidth="vw" sx={{ my: 3 }} component="main">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${dimensions["leftPane"]}px 10px auto`,
        }}
      >
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardHeader
            title="Editor"
            action={
              <>
                <IconButton>
                  <OpenInBrowser />
                </IconButton>
                <IconButton>
                  <OpenInFull />
                </IconButton>
              </>
            }
          />
          <CardContent sx={{ flex: 1 }}>
            <Editor id="editor" onChange={handleChange} value={markdown} />
          </CardContent>
        </Card>
        <Gutter onMouseDown={handleResize} />
        <Card>
          <CardHeader
            title="Previewer"
            action={
              <IconButton>
                <OpenInFull />
              </IconButton>
            }
          />
          <CardContent>
            <div
              id="preview"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(markdown)),
              }}
            ></div>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default MDPreviewer;
