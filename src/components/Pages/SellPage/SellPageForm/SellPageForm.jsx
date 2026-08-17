import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SendSellingFormData } from "../../../../services/sellingServices/sendSellingFormData/SendSellingFormData";
import { encryptFile, getEncryptionSecret } from "../../../../utils/fileEncryption";
import "./SellPageForm.css";

const categories = [
  {
    id: "cigars",
    number: "1",
    label: "Cigars",
    subtitle: "Cohiba, Montecristo, Pre-1980 Curated",
  },
  {
    id: "whisky",
    number: "2",
    label: "Whisky",
    subtitle: "Bordeaux, Burgundy, Rare Cognac",
  },
  {
    id: "watches",
    number: "3",
    label: "Watches",
    subtitle: "Patek Philippe, Audemars Piguet, Rolex",
  },

  {
    id: "pens",
    number: "4",
    label: "Luxury Pens",
    subtitle: "Montblanc, Cartier, Visconti",
  },
  {
    id: "yacht",
    number: "5",
    label: "Yacht",
    subtitle: "Sunseeker, Ferretti, Azimut",
  },
];

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1970 + 1 },
  (_, i) => currentYear - i,
);

const formFields = {
  watches: [
    { id: "specSection", label: "Watches - Specifications", type: "section" },
    {
      id: "brand",
      label: "Brand",
      type: "text",
      placeholder: "e.g. Patek Philippe",
      half: true,
    },
    {
      id: "model",
      label: "Model",
      type: "text",
      placeholder: "e.g. Nautilus 5711/1A",
      half: true,
    },
    {
      id: "serialNumber",
      label: "Serial Number",
      type: "text",
      placeholder: "Found on papers or caseback",
      half: true,
    },
    {
      id: "yearOfPurchase",
      label: "Year of Purchase",
      type: "select",
      options: years,
      half: true,
    },

    // Pricing & Auction
    { id: "pricingSection", label: "Pricing & Auction", type: "section" },
    {
      id: "originalPrice",
      label: "Original Price (USD)",
      type: "text",
      placeholder: "Value at acquisition",
      half: true,
    },
    {
      id: "expectedPrice",
      label: "Expected Price (USD)",
      type: "text",
      placeholder: "Expected Price",
      half: true,
    },
    {
      id: "auctionEndDate",
      label: "Select Auction End Date (Max 15 days)",
      type: "date",
      half: true,
    },

    // Condition & Accessories
    { id: "condSection", label: "Condition & Accessories", type: "section" },
    {
      id: "condition",
      label: "Current Condition",
      type: "select",
      options: ["Unworn / New", "Excellent", "Scratched", "Good", "Fair"],
      half: true,
    },
    {
      id: "Case",
      label: "Box Case available?",
      type: "select",
      options: ["Yes", "No"],
      half: true,
    },

    // Documentation
    { id: "docSection", label: "Documentation", type: "section" },
    {
      id: "Document1",
      label: "Papers",
      type: "file",
      placeholder: "Original certificate or warranty papers.",
      half: true,
    },
    {
      id: "Document2",
      label: "Certificates",
      type: "file",
      placeholder: "Service history or appraisal certificates.",
      half: true,
    },

    // Photo Requirements
    { id: "photoSection", label: "Photo Requirements", type: "section" },
    {
      id: "Image1",
      label: "Front / Dial View",
      type: "file",
      placeholder: "Sharp head-on shot showing the dial, hands, and bezel.",
      half: true,
    },
    {
      id: "Image2",
      label: "Case Back View",
      type: "file",
      placeholder: "Engravings, serial number, and hallmark details.",
      half: true,
    },
    {
      id: "Image3",
      label: "Crown & Side Profile",
      type: "file",
      placeholder: "Side view showing crown, pushers, and case finish.",
      half: true,
    },
    {
      id: "Image4",
      label: "Strap / Bracelet & Clasp",
      type: "file",
      placeholder: "Strap texture, links, and clasp wear.",
      half: true,
    },
    {
      id: "Image5",
      label: "Box & Papers presentation",
      type: "file",
      placeholder: "Outer box, presentation case, tag, and accessories.",
      half: true,
    },
  ],
  whisky: [
    {
      id: "specSection",
      label: "Whisky / Wine - Specifications",
      type: "section",
    },
    {
      id: "producerName",
      label: "Distillery / Producer Name",
      type: "text",
      placeholder: "e.g. Macallan, Lafite",
      half: true,
    },
    {
      id: "bottlingName",
      label: "Series / Bottling Name",
      type: "text",
      placeholder: "e.g. Rare Vintage, Gran Reserva",
      half: true,
    },
    {
      id: "vintageYear",
      label: "Vintage Year",
      type: "select",
      options: years,
      half: true,
    },
    {
      id: "age",
      label: "Age (Years Aged)",
      type: "text",
      placeholder: "e.g. 18 YO, 25 YO",
      half: true,
    },
    {
      id: "proof",
      label: "% ABV / Proof",
      type: "text",
      placeholder: "e.g. 43%",
      half: true,
    },
    {
      id: "bottleSize",
      label: "Bottle Size",
      type: "text",
      placeholder: "e.g. 70 cl, 750 ml",
      half: true,
    },
    {
      id: "productionType",
      label: "Production Type",
      type: "select",
      options: [
        "Single Malt",
        "Single Grain",
        "Blended Malt",
        "Red Wine",
        "White Wine",
        "Cognac / Brandy",
        "Other",
      ],
      half: true,
    },
    {
      id: "region",
      label: "Region",
      type: "select",
      options: [
        "Speyside",
        "Islay",
        "Highlands",
        "Lowlands",
        "Bordeaux",
        "Burgundy",
        "Champagne",
        "Other",
      ],
      half: true,
    },
    {
      id: "bottlingType",
      label: "Bottling Type",
      type: "select",
      options: ["Distillery Bottling", "Independent Bottler", "Estate Bottled"],
      half: true,
    },
    {
      id: "distilleryStatus",
      label: "Distillery Status",
      type: "select",
      options: ["Active", "Closed / Silent", "N/A"],
      half: true,
    },
    {
      id: "bottle",
      label: "Bottle / Container Type",
      type: "select",
      options: ["Standard Bottle", "Decanter", "Magnum", "Cask / Barrel"],
      half: true,
    },

    { id: "quantitySection", label: "Quantity & Storage", type: "section" },
    {
      id: "quantity",
      label: "Quantity (Bottles / Units)",
      type: "text",
      placeholder: "e.g. 1",
      half: true,
    },
    {
      id: "storageCondition",
      label: "Storage Condition",
      type: "select",
      options: [
        "Cellar / Climate Controlled",
        "Bonded Warehouse",
        "Home Storage",
      ],
      half: true,
    },

    { id: "docSection", label: "Documentation", type: "section" },
    {
      id: "Document1",
      label: "Acquisition Invoice / Receipt",
      type: "file",
      placeholder: "Proof of purchase, retail receipt, or auction invoice.",
      half: true,
    },
    {
      id: "Document2",
      label: "Cellar / Bonded Storage Certificate",
      type: "file",
      placeholder: "Official storage statement or climate logs.",
      half: true,
    },

    { id: "photoSection", label: "Photo Requirements", type: "section" },
    {
      id: "Image1",
      label: "Front Label View",
      type: "file",
      placeholder:
        "Clear head-on shot of the front label showing logo and text.",
      half: true,
    },
    {
      id: "Image2",
      label: "Back Label & Barcode",
      type: "file",
      placeholder: "Importers labels, back stamp, and barcode details.",
      half: true,
    },
    {
      id: "Image3",
      label: "Capsule, Seal & Fill Level",
      type: "file",
      placeholder:
        "Close-up of seal integrity and visible fill level (ullage).",
      half: true,
    },
    {
      id: "Image4",
      label: "Base / Glass Engravings",
      type: "file",
      placeholder: "Bottom of the bottle showing glass mold serial numbers.",
      half: true,
    },
    {
      id: "Image5",
      label: "Original Case & Packaging",
      type: "file",
      placeholder: "Original wooden box, carton, booklet, or outer case.",
      half: true,
    },

    // Pricing
    { id: "originalPrice", label: "Pricing & Value", type: "section" },
    {
      id: "expectedPrice",
      label: "Estimated Value (USD)",
      type: "text",
      placeholder: "Total desired value for the listing",
      half: true,
    },
  ],
  cigars: [
    // Cigars - Specifications
    { id: "specSection", label: "Cigars - Specifications", type: "section" },
    {
      id: "editionName",
      label: "Release / Edition Name",
      type: "text",
      placeholder: "e.g. Partagas Lusitanias 2024",
      half: true,
    },
    {
      id: "brand",
      label: "Brand",
      type: "text",
      placeholder: "e.g. Partagas, Cohiba",
      half: true,
    },
    {
      id: "commercialShape",
      label: "Vitola (Factory / Commercial Shape)",
      type: "text",
      placeholder: "e.g. Prominentes, Robusto",
      half: true,
    },
    {
      id: "boxYear",
      label: "Box Year (Production Date)",
      type: "select",
      options: years,
      half: true,
    },
    {
      id: "length",
      label: "Ring Gauge & Length",
      type: "text",
      placeholder: "e.g. 49 / 194mm (7.6 inches)",
      half: true,
    },
    {
      id: "origin",
      label: "Country of Origin",
      type: "select",
      options: ["Cuba", "Dominican Republic", "Nicaragua", "Honduras", "Other"],
      half: true,
    },
    {
      id: "packagingType",
      label: "Packaging Type",
      type: "text",
      placeholder: "e.g. Dress Box of 25, Cabinet of 50",
      half: true,
    },
    {
      id: "quantity",
      label: "Quantity (Cigars Included)",
      type: "text",
      placeholder: "e.g. 25",
      half: true,
    },

    // Storage & Preservation
    { id: "storageSection", label: "Storage & Preservation", type: "section" },
    {
      id: "orignalBox",
      label: "Original Box / Humidor Status",
      type: "select",
      options: ["Yes – Sealed", "Yes – Opened", "No Box - Loose Cigars"],
      half: true,
    },

    // Documentation
    { id: "docSection", label: "Documentation", type: "section" },
    {
      id: "Document1",
      label: "Purchase Invoice / Receipt",
      type: "file",
      placeholder: "Receipt or invoice showing purchase source and date.",
      half: true,
    },
    {
      id: "Document2",
      label: "Humidor Storage climate statement",
      type: "file",
      placeholder: "Log of temperature and humidity conditions (RH %).",
      half: true,
    },

    // Photo Requirements
    { id: "photoSection", label: "Photo Requirements", type: "section" },
    {
      id: "Image1",
      label: "Box Lid & Branding",
      type: "file",
      placeholder: "Top view of the box showing labels, branding, and decals.",
      half: true,
    },
    {
      id: "Image2",
      label: "Box Bottom (Factory Hot Stamps)",
      type: "file",
      placeholder:
        "Underneath showing official hot stamps, factory & date codes.",
      half: true,
    },
    {
      id: "Image3",
      label: "Open Box (Cigars Layout)",
      type: "file",
      placeholder:
        "Full view of cigars aligned inside box showing bands & wrappers.",
      half: true,
    },
    {
      id: "Image4",
      label: "Cuban Warranty Seal / Hologram",
      type: "file",
      placeholder: "Close-up of green warranty seal and barcode/serial number.",
      half: true,
    },
    {
      id: "Image5",
      label: "Cigar Band & Cap close-up",
      type: "file",
      placeholder: "Macro shot of individual cigar head, band, and foot.",
      half: true,
    },

    // Pricing
    { id: "originalPrice", label: "Pricing & Value", type: "section" },
    {
      id: "expectedPrice",
      label: "Asking Price (USD)",
      type: "text",
      placeholder: "Your desired price",
      half: true,
    },
  ],
  pens: [
    // Pens - Specifications
    { id: "specSection", label: "Pens - Specifications", type: "section" },
    {
      id: "brand",
      label: "Brand",
      type: "text",
      placeholder: "e.g. Montblanc, Namiki",
      half: true,
    },
    {
      id: "model",
      label: "Model / Collection Name",
      type: "text",
      placeholder: "e.g. Meisterstück 149, Emperor",
      half: true,
    },
    {
      id: "penType",
      label: "Pen Type",
      type: "select",
      options: ["Fountain", "Rollerball", "Ballpoint"],
      half: true,
    },
    {
      id: "manifacturingYear",
      label: "Year of Manufacturing",
      type: "select",
      options: years,
      half: true,
    },
    {
      id: "limitedEditionRegistry",
      label: "Limited Edition Registry (If applicable)",
      type: "text",
      placeholder: "e.g. No. 012 / 888",
      half: true,
    },
    {
      id: "serialNumber",
      label: "Serial Number (Mandatory)",
      type: "text",
      placeholder: "Enter serial number",
      half: true,
    },

    // Nib Specifics (Fountain Pens Only)
    {
      id: "nibSection",
      label: "Nib Specifics (Fountain Pens Only)",
      type: "section",
      condition: (data) => data.penType === "Fountain",
    },
    {
      id: "nibMaterial",
      label: "Nib Material",
      type: "text",
      placeholder: "e.g. 14K Gold, 18K Gold, Platinum",
      half: true,
      condition: (data) => data.penType === "Fountain",
    },
    {
      id: "nibSize",
      label: "Nib Size / Width",
      type: "select",
      options: ["EF", "F", "M", "B", "BB", "Stub", "Zoom"],
      half: true,
      condition: (data) => data.penType === "Fountain",
    },

    // Materials & Mechanics
    { id: "materialsSection", label: "Materials & Mechanics", type: "section" },
    {
      id: "bodyMaterial",
      label: "Body Material",
      type: "text",
      placeholder: "e.g. Precious Resin, Urushi Lacquer",
      half: true,
    },
    {
      id: "trim",
      label: "Trim",
      type: "text",
      placeholder: "e.g. Rose Gold Plated, Ruthenium",
      half: true,
    },
    {
      id: "fillingMechanism",
      label: "Filling Mechanism",
      type: "select",
      options: ["Piston Filler", "Vacumatic", "Eyedropper", "Other"],
      half: true,
    },

    // Condition
    { id: "conditionSection", label: "Condition", type: "section" },
    {
      id: "condition",
      label: "Condition Grade",
      type: "select",
      options: ["Mint / Uninked", "Near Mint", "Excellent", "Good"],
      half: true,
    },
    {
      id: "orignalOuterBox",
      label: "Inclusions",
      type: "checkbox-group",
      options: ["Original Outer Box", "Presentation Case", "Service Guide"],
      half: false,
    },

    // Photo Requirements
    { id: "photoSection", label: "Photo Requirements", type: "section" },
    {
      id: "Image1",
      label: "Full Pen (Capped)",
      type: "file",
      placeholder:
        "Image showing total alignment and overall cosmetic condition.",
      half: true,
    },
    {
      id: "Image2",
      label: "Full Pen (Uncapped)",
      type: "file",
      placeholder: "Visible section grip wear.",
      half: true,
    },
    {
      id: "Image3",
      label: "Macro Nib",
      type: "file",
      placeholder: "Image focused on the tip material.",
      half: true,
    },
    {
      id: "Image4",
      label: "Cap ring and engravings",
      type: "file",
      placeholder:
        "Zoomed image of manufacturing laser serial number to match with the provided details.",
      half: true,
    },
    {
      id: "Image5",
      label: "Box and/or authenticity certificate.",
      type: "file",
      placeholder: "Images of box, papers, or certificate.",
      half: true,
    },

    // Pricing
    { id: "originalPrice", label: "Pricing", type: "section" },
    {
      id: "expectedPrice",
      label: "Asking Price (USD)",
      type: "text",
      placeholder: "Your desired price",
      half: true,
    },
  ],
  yacht: [
    // Yacht - Specifications
    { id: "specSection", label: "Yacht - Specifications", type: "section" },
    {
      id: "make",
      label: "Make / Brand",
      type: "text",
      placeholder: "e.g. Sunseeker, Ferretti",
      half: true,
    },
    {
      id: "model",
      label: "Model",
      type: "text",
      placeholder: "e.g. Manhattan 68",
      half: true,
    },
    {
      id: "yearBuilt",
      label: "Year Built",
      type: "select",
      options: years,
      half: true,
    },
    {
      id: "length",
      label: "Length (meters / feet)",
      type: "text",
      placeholder: "e.g. 22m (72ft)",
      half: true,
    },
    {
      id: "hullType",
      label: "Hull Type",
      type: "select",
      options: [
        "Motor Yacht",
        "Sailing Yacht",
        "Catamaran",
        "Superyacht",
        "Speedboat",
      ],
      half: true,
    },
    {
      id: "registry",
      label: "Flag / Registry",
      type: "text",
      placeholder: "e.g. Cayman Islands",
      half: true,
    },
    {
      id: "condition",
      label: "Current Condition",
      type: "select",
      options: ["Showroom / Pristine", "Excellent", "Good", "Needs Refit"],
      half: true,
    },

    // Documentation
    { id: "docSection", label: "Documentation", type: "section" },
    {
      id: "Document1",
      label: "Certificate of Registry / Ownership",
      type: "file",
      placeholder: "Official ship registry papers.",
      half: true,
    },
    {
      id: "Document2",
      label: "Marine Survey Report (Recent)",
      type: "file",
      placeholder: "Condition appraisal or hull survey report.",
      half: true,
    },
    {
      id: "Document3",
      label: "Maintenance Logbook & Records",
      type: "file",
      placeholder: "Service history or mechanical logs.",
      half: true,
    },

    // Photo Requirements
    { id: "photoSection", label: "Photo Requirements", type: "section" },
    {
      id: "Image1",
      label: "Exterior Profile (Side View)",
      type: "file",
      placeholder: "Wide angle shot of the yacht profile on water.",
      half: true,
    },
    {
      id: "Image2",
      label: "Helm Station & Flybridge",
      type: "file",
      placeholder: "Electronics, navigation cockpit, and controls.",
      half: true,
    },
    {
      id: "Image3",
      label: "Aft Deck & Cockpit lounge",
      type: "file",
      placeholder: "Outdoor lounge, swim platform, and dining space.",
      half: true,
    },
    {
      id: "Image4",
      label: "Main Saloon & Staterooms",
      type: "file",
      placeholder: "Main living areas, seating, cabin layouts.",
      half: true,
    },
    {
      id: "Image5",
      label: "Engine Room / Propulsion",
      type: "file",
      placeholder: "Close-up of main engines, generators, and bilge.",
      half: true,
    },

    // Pricing
    { id: "originalPrice", label: "Pricing & Value", type: "section" },
    {
      id: "expectedPrice",
      label: "Asking Price (USD)",
      type: "text",
      placeholder: "Your desired price",
      half: true,
    },
  ],
};

const buildSchema = (category) => {
  const fields = formFields[category] || [];
  const shape = {};

  fields.forEach((field) => {
    if (field.type === "section") return;
    if (field.type === "file") return;

    if (field.type === "checkbox-group") {
      shape[field.id] = yup.array().of(yup.string());
      return;
    }

    shape[field.id] = yup.string().required(`${field.label} is required`);
  });

  return yup.object().shape(shape);
};

const SellPageForm = () => {
  
  const [activeCategory, setActiveCategory] = useState("cigars");
  const [activeCategoryNumber, setActiveCategoryNumber] = useState("1");

  const [fileNames, setFileNames] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const fileVersions = useRef({});
  const formRef = useRef(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  
  const fields = formFields[activeCategory] || [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(buildSchema(activeCategory)),
    defaultValues: {},
  });

  const watchedValues = watch();

  const handleCategoryChange = (id, number) => {
    setActiveCategory(id);
    setActiveCategoryNumber(number);
    setFileNames({});
    setSelectedFiles({});
    reset({});
  };

  const validateFile = (file, id) => {
    if (!file) return "File does not exist.";
    
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return "File size exceeds 10MB limit.";
    }
    
    const ext = file.name.split('.').pop().toLowerCase();
    const isDocument = id.toLowerCase().includes("document");
    const isImage = id.toLowerCase().includes("image") || id.startsWith("photo");
    
    if (isDocument) {
      const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(ext)) {
        return "Invalid file extension. Allowed: .pdf, .jpg, .jpeg, .png";
      }
    } else if (isImage) {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!allowedExtensions.includes(ext) && !file.type.startsWith("image/")) {
        return "Invalid image file. Allowed image formats only.";
      }
    }
    
    return null;
  };

  const recalculateLogicalNames = (filesObj) => {
    const docKeys = Object.keys(filesObj)
      .filter((k) => k.toLowerCase().includes("document"))
      .sort();
    docKeys.forEach((key, index) => {
      filesObj[key].logicalName = `Document${index + 1}`;
    });

    const imgKeys = Object.keys(filesObj)
      .filter((k) => k.toLowerCase().includes("image"))
      .sort();
    imgKeys.forEach((key, index) => {
      filesObj[key].logicalName = `Image${index + 1}`;
    });
  };

  const handleFileChange = async (e) => {
    const { id, files } = e.target;
    const version = (fileVersions.current[id] || 0) + 1;
    fileVersions.current[id] = version;

    if (!files || files.length === 0) {
      setFileNames((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSelectedFiles((prev) => {
        const next = { ...prev };
        delete next[id];
        recalculateLogicalNames(next);
        return next;
      });
      return;
    }

    const file = files[0];
    const validationError = validateFile(file, id);
    if (validationError) {
      alert(validationError);
      e.target.value = "";
      return;
    }

    setFileNames((prev) => ({ ...prev, [id]: file.name }));
    setIsEncrypting(true);

    try {
      const secret = getEncryptionSecret();
      const encryptedData = await encryptFile(file, secret);

      if (fileVersions.current[id] !== version) {
        return; // Stale selection
      }

      setSelectedFiles((prev) => {
        const next = {
          ...prev,
          [id]: {
            encryptedBlob: encryptedData.encryptedBlob,
            originalFileName: encryptedData.originalFileName,
            contentType: encryptedData.contentType,
            salt: encryptedData.salt,
            iv: encryptedData.iv,
            encryptionAlgorithm: "AES-256-GCM",
            encryptionVersion: 1,
            logicalName: ""
          }
        };
        recalculateLogicalNames(next);
        return next;
      });
    } catch (err) {
      console.error("Encryption failed:", err);
      setFileNames((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSelectedFiles((prev) => {
        const next = { ...prev };
        delete next[id];
        recalculateLogicalNames(next);
        return next;
      });
      alert("Security Error: Failed to encrypt the selected file. Details: " + err.message);
    } finally {
      setIsEncrypting(false);
    }
  };

  const onSubmit = (data) => {
    if (isEncrypting) {
      alert("Encryption is in progress. Please wait.");
      return;
    }
    const formData = new FormData();
    
    // Append standard fields
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((val) => formData.append(key, val));
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    formData.append("categoryId", activeCategoryNumber);

    // Append encrypted files and metadata
    Object.keys(selectedFiles).forEach((key) => {
      const fileData = selectedFiles[key];
      if (fileData && fileData.encryptedBlob) {
        const logicalName = fileData.logicalName;
        formData.append(logicalName, fileData.encryptedBlob, `${logicalName}.enc`);
        formData.append(`${logicalName}_originalFileName`, fileData.originalFileName);
        formData.append(`${logicalName}_contentType`, fileData.contentType);
        formData.append(`${logicalName}_salt`, fileData.salt);
        formData.append(`${logicalName}_iv`, fileData.iv);
        formData.append(`${logicalName}_encryptionAlgorithm`, fileData.encryptionAlgorithm);
        formData.append(`${logicalName}_encryptionVersion`, String(fileData.encryptionVersion));
      }
    });

    SendSellingFormData(formData)
      .then((res) => {
        console.log(res);
        reset();
        setFileNames({});
        setSelectedFiles({});
        fileVersions.current = {};
        if (formRef.current) {
          formRef.current.reset();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="sell-form-section">
      <div className="sell-form-container">
        <div className="sell-categories">
          <div className="sell-categories-label">
            <span>Select Category</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>

          <div className="sell-category-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`sell-category-card${activeCategory === cat.id ? " active" : ""}`}
                onClick={() => handleCategoryChange(cat.id, cat.number)}
                type="button"
              >
                {activeCategory === cat.id && (
                  <span className="sell-category-check">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                )}
                <span className="sell-category-name">{cat.label}</span>
                <span className="sell-category-sub">{cat.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sell-form-panel">
          <form
            ref={formRef}
            className="sell-form-fields"
            key={activeCategory}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {fields.map((field) => {
              if (field.condition && !field.condition(watchedValues)) {
                return null;
              }

              if (field.type === "section") {
                return (
                  <div
                    key={field.id}
                    className="sell-field-group full sell-section-divider"
                  >
                    <h3 className="sell-section-title">{field.label}</h3>
                  </div>
                );
              }

              return (
                <div
                  key={field.id}
                  className={`sell-field-group${field.half ? " half" : " full"}`}
                >
                  <label htmlFor={field.id} className="sell-field-label">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <div className="sell-select-wrapper">
                      <select
                        id={field.id}
                        className="sell-field-input sell-field-select"
                        {...register(field.id)}
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <span className="sell-select-arrow">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                      {errors[field.id] && (
                        <span className="sell-field-error">
                          {errors[field.id].message}
                        </span>
                      )}
                    </div>
                  ) : field.type === "checkbox-group" ? (
                    <Controller
                      name={field.id}
                      control={control}
                      defaultValue={[]}
                      render={({ field: controllerField }) => (
                        <div className="sell-checkbox-group">
                          {field.options.map((opt) => {
                            const isChecked = (
                              controllerField.value || []
                            ).includes(opt);
                            return (
                              <label key={opt} className="sell-checkbox-label">
                                <input
                                  type="checkbox"
                                  className="sell-checkbox-input"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const currentVal =
                                      controllerField.value || [];
                                    const newVal = e.target.checked
                                      ? [...currentVal, opt]
                                      : currentVal.filter((val) => val !== opt);
                                    controllerField.onChange(newVal);
                                  }}
                                />
                                <span className="sell-checkbox-custom" />
                                <span className="sell-checkbox-text">
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    />
                  ) : field.type === "file" ? (
                    <label className="sell-file-upload" htmlFor={field.id}>
                      <input
                        id={field.id}
                        type="file"
                        className="sell-file-input-hidden"
                        multiple={field.id === "addImages"}
                        accept={
                          field.id === "addImages" ||
                            field.id.startsWith("photo")
                            ? "image/*"
                            : ".pdf,.jpg,.jpeg,.png"
                        }
                        onChange={handleFileChange}
                      />
                      <span className="sell-file-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </span>
                      <span className="sell-file-text">
                        {fileNames[field.id] ? (
                          <span className="sell-file-name">
                            {fileNames[field.id]}
                          </span>
                        ) : (
                          <span className="sell-file-placeholder-wrapper">
                            <span className="sell-file-placeholder">
                              Click to upload
                            </span>
                            {field.placeholder && (
                              <span className="sell-file-helper">
                                {field.placeholder}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                      <span className="sell-file-btn">Browse</span>
                    </label>
                  ) : (
                    <>
                      <input
                        id={field.id}
                        type={field.type}
                        className="sell-field-input"
                        placeholder={field.placeholder}
                        {...register(field.id)}
                      />
                      {errors[field.id] && (
                        <span className="sell-field-error">
                          {errors[field.id].message}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            <div className="sell-authenticity-box">
              <div className="sell-authenticity-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="sell-authenticity-title">Authenticity Protocol</p>
                <p className="sell-authenticity-text">
                  All listed Products undergo a physical inspection at our
                  central vault in Geneva. Please ensure all documentation and
                  original boxes are available for the appraisal phase.
                </p>
              </div>
            </div>

            <div
              className="sell-form-footer"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <button type="submit" className="sell-btn-next" disabled={isEncrypting}>
                {isEncrypting ? "Encrypting..." : "Submit"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SellPageForm;
