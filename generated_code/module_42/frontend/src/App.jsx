import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { Layers, MonitorPlay } from 'lucide-react';

const MODULE_LABEL = "Responsive Layout and Button Grid Styling";

export default function App() {
  return (
    <Box className="screen">
      <Paper className="panel" elevation={0}>
        <Stack spacing={2.5}>
        <div className="title-row"><MonitorPlay size={22} /><span>Vite React preview</span></div>
        <Typography variant="h2" component="h1">{MODULE_LABEL}</Typography>
        <div className="feature-row"><Layers size={18} /><p>Frontend modules use Material UI/shadcn-style composition and render as a runnable Vite app in E2B.</p></div>
        </Stack>
      </Paper>
    </Box>
  );
}