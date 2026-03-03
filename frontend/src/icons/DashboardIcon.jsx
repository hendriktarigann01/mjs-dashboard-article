const DashboardIcon = ({ active = false, className = "" }) => {
  return (
    <svg
      className={`${className}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={active ? "#3AAFA9" : "#888888"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_dashboard"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <rect width="20" height="20" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_dashboard)">
        <path
          d="M11.041 7.50008V2.91675H17.0827V7.50008H11.041ZM2.91602 10.4167V2.91675H8.95768V10.4167H2.91602ZM11.041 17.0834V9.58342H17.0827V17.0834H11.041ZM2.91602 17.0834V12.5001H8.95768V17.0834H2.91602Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default DashboardIcon;
