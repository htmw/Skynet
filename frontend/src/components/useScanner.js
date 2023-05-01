import {createContext, useContext, useEffect, useRef, useState} from "react";
import Quagga from 'quagga'

const ScannerContext = createContext();

const useScan = () => {
  const [active, setActive] = useState(false);
  const [callback, setCallback] = useState();
  return {
    active,
    callback,
    stop: () => {
      setActive(false)
    },
    start: (cb) => {
      setActive(true);
      setCallback(() => val => cb(val));
    }
  }
}

export const ScannerProvider = ({children}) => {
  const ref = useRef();
  const scan = useScan();
  const {active, callback, stop} = scan;
  useEffect(() => {
    if (active && ref.current) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          constraints: {
            width: '1090',
            height: '690'
          },
          numberOfWorkers: navigator.hardwareConcurrency,
          target: ref.current
        },
        locate: true,
        decoder: {
          readers: ["code_128_reader", "upc_reader", "upc_e_reader"]
        }
      }, function (err) {
        if (err) {
          return
        }
        Quagga.start()
      })

      Quagga.onDetected((res) => {
        const code = res.codeResult.code;
        console.log(`barcode scanned: ${code}`);
        alert(`barcode scanned: ${code}`);
        callback && callback(code);
        stop();
        Quagga.stop();
        Quagga.offProcessed();
      });
    }
  }, [active]);
  return (
    <ScannerContext.Provider value={scan}>
      {active && <div className={'scanner'} ref={ref}></div>}
      {children}
    </ScannerContext.Provider>
  )
}

export const useScanner = () => {
  return useContext(ScannerContext);
}
