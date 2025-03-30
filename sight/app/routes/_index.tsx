import { useState, useEffect, useRef } from "react"
import styles from "app/styles/NetmonSight.css?url"

interface NetworkDataItem {
  daemon_id: string
  packets_rx: number
  bytes_rx: number
}

interface NetworkStats {
  daemons: number
  packetsPerSec: number
  bytesPerSec: string
}

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function NetmonSight() {
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    daemons: 0,
    packetsPerSec: 0,
    bytesPerSec: "0 B",
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight - 120
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // const response = await fetch("http://localhost:3000/network")
        // const data: NetworkDataItem[] =  await response.json()
        const data: NetworkDataItem[] = [{
          daemon_id: "eth0",
          packets_rx: 89,
          bytes_rx: 748,
        }]

        const totalDaemons = new Set(data.map((item) => item.daemon_id)).size
        const totalPackets = data.reduce((sum, item) => sum + item.packets_rx, 0)
        const totalBytes = data.reduce((sum, item) => sum + item.bytes_rx, 0)

        setNetworkStats({
          daemons: totalDaemons,
          packetsPerSec: totalPackets,
          bytesPerSec: formatBytes(totalBytes),
        })
      } catch (error) {
        console.error("Error fetching network data:", error)
      }
    }

    const intervalId = setInterval(fetchNetworkData, 1000)
    fetchNetworkData()

    return () => clearInterval(intervalId)
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="netmon-sight">
      <nav className="nav-bar">
        <div className="logo">
          <span className="logo-text">netmon-sight</span>
        </div>
        <ul className="nav-links">
          <li className="active"><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <canvas ref={canvasRef} className="gl-canvas" />
      </main>

      <footer className="status-bar">
        <div className="stats">
          <span>Daemons: {networkStats.daemons}</span>
          <span>Packets/s: {networkStats.packetsPerSec.toLocaleString()}</span>
          <span>Bytes/s: {networkStats.bytesPerSec}</span>
        </div>
      </footer>
    </div>
  )
}
