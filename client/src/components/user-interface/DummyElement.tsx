import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";

export const DummyComponent = () => {
  return (
    <div>
      <Box
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" sx={{ width: "300px" }} />
        </Box>
        <Skeleton
          variant="rectangular"
          width={600}
          height={118}
          sx={{ borderRadius: "15px" }}
        />
      </Box>
      <Box
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" sx={{ width: "300px" }} />
        </Box>
        <Skeleton
          variant="rectangular"
          width={600}
          height={118}
          sx={{ borderRadius: "15px" }}
        />
      </Box>
      <Box
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" sx={{ width: "300px" }} />
        </Box>
        <Skeleton
          variant="rectangular"
          width={600}
          height={118}
          sx={{ borderRadius: "15px" }}
        />
      </Box>
    </div>
  );
};
