// // import { StyleSheet, Text, View, Pressable } from "react-native";

// // import {
// //   WalletConnectModal,
// //   useWalletConnectModal,
// // } from "@walletconnect/modal-react-native";
// // // Add in the useWalletConnectModal hook

// // const projectId = "...";

// // const providerMetadata = {
// //   name: "YOUR_PROJECT_NAME",
// //   description: "YOUR_PROJECT_DESCRIPTION",
// //   url: "https://your-project-website.com/",
// //   icons: ["https://your-project-logo.com/"],
// //   redirect: {
// //     native: "YOUR_APP_SCHEME://",
// //     universal: "YOUR_APP_UNIVERSAL_LINK.com",
// //   },
// // };3v

// // export default function App() {
// //   // Add in the useWalletConnectModal hook + props
// //   const { open, isConnected, address, provider } = useWalletConnectModal();

// //   // Function to handle the
// //   const handleButtonPress = async () => {
// //     if (isConnected) {
// //       return provider?.disconnect();
// //     }
// //     return open();
// //   };

// //   // Main UI Render
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.heading}>WalletConnect Modal RN Tutorial</Text>
// //       <Text>{isConnected ? address : "No Connected"}</Text>
// //       <Pressable onPress={handleButtonPress} style={styles.pressableMargin}>
// //         <Text>{isConnected ? "Disconnect" : "Connect"}</Text>
// //       </Pressable>

// //       <WalletConnectModal
// //         projectId={projectId}
// //         providerMetadata={providerMetadata}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#fff",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   heading: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     marginBottom: 16,
// //   },
// //   pressableMargin: {
// //     marginTop: 16,
// //   },
// // });



// import '@walletconnect/react-native-compat'
// import '@ethersproject/shims'

// import { createWeb3Modal, defaultConfig, Web3Modal } from '@web3modal/ethers5-react-native'

// // 1. Get projectId from https://cloud.walletconnect.com
// const projectId = 'YOUR_PROJECT_ID'

// // 2. Create config
// const metadata = {
//   name: 'Web3Modal RN',
//   description: 'Web3Modal RN Example',
//   url: 'https://web3modal.com',
//   icons: ['https://avatars.githubusercontent.com/u/37784886'],
//   redirect: {
//     native: 'YOUR_APP_SCHEME://'
//   }
// }

// const config = defaultConfig({ metadata })

// // 3. Define your chains
// const mainnet = {
//   chainId: 1,
//   name: 'Ethereum',
//   currency: 'ETH',
//   explorerUrl: 'https://etherscan.io',
//   rpcUrl: 'https://cloudflare-eth.com'
// }

// const polygon = {
//   chainId: 137,
//   name: 'Polygon',
//   currency: 'MATIC',
//   explorerUrl: 'https://polygonscan.com',
//   rpcUrl: 'https://polygon-rpc.com'
// }

// const chains = [mainnet, polygon]

// // 4. Create modal
// createWeb3Modal({
//   projectId,
//   chains,
//   config,
//   enableAnalytics: true // Optional - defaults to your Cloud configuration
// })

// export default function App() {
//   return (
//     <>
//       // Rest of your app...
//       <Web3Modal />
//     </>
//   )
// }