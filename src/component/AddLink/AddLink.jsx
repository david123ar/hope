"use client";
import React, { useEffect, useState } from "react";
import "./addLink.css";
import { HiPencil } from "react-icons/hi";
import { IoIosMore, IoMdAdd } from "react-icons/io";
import { FiLink } from "react-icons/fi";
import { AiOutlineHolder } from "react-icons/ai";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Fill } from "react-icons/ri";

import {
  DndContext,
  closestCenter,
  TouchSensor,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Navbar from "../Navbar/Navbar";
import { SessionProvider, useSession } from "next-auth/react";
import Footer from "../Footer/Footer";
import BottomNavBar from "../BottomNavBar/BottomNavBar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { imageData } from "@/data/imageData";
import Share from "../Share/Share";

const SortableItem = ({
  id,
  link,
  index,
  editingIndex,
  editingField,
  editingValue,
  setEditingIndex,
  setEditingField,
  setEditingValue,
  onSaveEdit,
  isVisible,
  toggleVisibility,
  handleDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditingName = editingIndex === index && editingField === "name";
  const isEditingUrl = editingIndex === index && editingField === "url";

  const [screenWidth, setScreenWidth] = useState(1024); // Default for SSR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      setScreenWidth(window.innerWidth);

      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const maxChars = screenWidth < 500 ? 18 : 50;

  return (
    <div ref={setNodeRef} style={style} className="link-item" {...attributes}>
      <div className="link-1">
        <div className="hold" {...listeners}>
          <AiOutlineHolder />
        </div>
        <div className="linkh">
          <div
            className="link-name"
            onClick={() => {
              setEditingIndex(index);
              setEditingField("name");
              setEditingValue(link.name);
            }}
          >
            {isEditingName ? (
              <input
                type="text"
                value={editingValue}
                autoFocus
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => onSaveEdit(index, "name", editingValue)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    onSaveEdit(index, "name", editingValue);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "inherit",
                  width: "100%",
                }}
              />
            ) : (
              <>
                {link.name.length > maxChars
                  ? `${link.name.slice(0, maxChars)}...`
                  : link.name}
                <GoPencil />
              </>
            )}
          </div>

          <div
            className="link-url"
            onClick={() => {
              setEditingIndex(index);
              setEditingField("url");
              setEditingValue(link.url);
            }}
          >
            {isEditingUrl ? (
              <input
                type="text"
                value={editingValue}
                autoFocus
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => onSaveEdit(index, "url", editingValue)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveEdit(index, "url", editingValue);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "inherit",
                  width: "100%",
                }}
              />
            ) : (
              <div className="linkp">
                {link.url.length > maxChars
                  ? `${link.url.slice(0, maxChars)}...`
                  : link.url}
                <GoPencil />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="link-2">
        <button
          onClick={toggleVisibility}
          className={`toggle-switch ${isVisible ? "on" : "off"}`}
          aria-pressed={isVisible}
          aria-label={isVisible ? "Hide Link" : "Show Link"}
        >
          <span className="slider" />
        </button>
        <div className="delete" onClick={() => handleDelete(id)}>
          <RiDeleteBin6Fill />
        </div>
      </div>
    </div>
  );
};

const AddLink = (props) => {
  const [showModal, setShowModal] = useState(false);
  const { data: session, update } = useSession();
  const [user, setUser] = useState("");
  const [bio, setBio] = useState("");

  const [newAvatar, setNewAvatar] = useState("");
  const [showModali, setShowModali] = useState(false);

  // Keep local state in sync with session data
  useEffect(() => {
    if (session?.user) {
      setUser(session.user.username || "");
      setBio(session.user.bio || "");
      setNewAvatar(session.user.avatar || "");
    }
  }, [session]);

  const [visibleLinks, setVisibleLinks] = useState({});

  const [isAdding, setIsAdding] = useState(false);
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null); // "name" or "url"
  const [editingValue, setEditingValue] = useState("");
  const [selectedLink, setSelectedLink] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch("/api/links");
        const data = await res.json();

        if (data.links) {
          setLinks(data.links);
          const visibilityMap = {};
          data.links.forEach((link) => {
            visibilityMap[link.id] = link.visible ?? true;
          });
          setVisibleLinks(visibilityMap);
        }

        if (data.design) {
          setSelectedLink(data.design); // Load the saved design
        }
      } catch (error) {
        console.error("Failed to fetch links or design:", error);
      }
    };

    fetchLinks();
  }, []);

  const handleAddReferralLink = () => {
    setName("Referral Link");
    setUrl(`https://biolynk.shoko.fun/${session?.user?.id}`); // <-- Replace with your actual referral link
    setIsAdding(true);
  };

  const handleAddLink = async () => {
    if (!name || !url) return;
    const newLink = {
      id: Date.now().toString(),
      name,
      url,
      visible: true,
      position: links.length, // append to the end
    };

    setLinks((prev) => [...prev, newLink]);
    setVisibleLinks((prev) => ({ ...prev, [newLink.id]: true }));
    setName("");
    setUrl("");
    setIsAdding(false);

    try {
      await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      });
    } catch (err) {
      console.error("Error saving link to DB:", err);
    }
  };

  const toggleLinkVisibility = async (id) => {
    setVisibleLinks((prev) => {
      const newVisible = !prev[id];

      // Update DB
      fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field: "visible", value: newVisible }),
      }).catch((err) => console.error("Error updating visibility in DB:", err));

      return { ...prev, [id]: newVisible };
    });
  };

  const handleSave = async () => {
    if (!user.trim()) {
      alert("Display name cannot be empty.");
      return;
    }

    try {
      const updatedFields = {};

      if (user !== session?.user?.username) updatedFields.username = user;
      if (bio !== session?.user?.bio) updatedFields.bio = bio;
      if (newAvatar !== session?.user?.avatar) updatedFields.avatar = newAvatar;

      if (Object.keys(updatedFields).length === 0) {
        alert("No changes detected.");
        return;
      }

      updatedFields.userId = session?.user?.id;

      const res = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      // ✅ Update client session
      await update({
        ...(updatedFields.username && { username: updatedFields.username }),
        ...(updatedFields.bio && { bio: updatedFields.bio }),
        ...(updatedFields.avatar && { avatar: updatedFields.avatar }),
      });

      console.log("Profile updated successfully");
      setShowModal(false);
      setShowModali(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "Something went wrong.");
    }
  };

  const handleCancel = () => {
    setName("");
    setUrl("");
    setIsAdding(false);
  };

  const onSaveEdit = async (index, field, value) => {
    const updatedLinks = [...links];
    const id = updatedLinks[index].id;
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
    setEditingIndex(null);
    setEditingField(null);
    setEditingValue("");

    try {
      await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value }),
      });
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((item) => item.id === active.id);
    const newIndex = links.findIndex((item) => item.id === over.id);

    const newLinks = arrayMove(links, oldIndex, newIndex);
    setLinks(newLinks);

    // Persist new positions
    try {
      await fetch("/api/links/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: newLinks.map((link, index) => ({
            id: link.id,
            position: index,
          })),
        }),
      });
    } catch (err) {
      console.error("Error updating link order:", err);
    }
  };

  const handleDelete = async (id) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));

    try {
      await fetch("/api/links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const [isView, setIsView] = useState(false);

  const isUnchanged =
    user === session?.user?.username && bio === session?.user?.bio;

  return (
    <>
      <Navbar />
      {showModali && (
        <div className="avatar-modal" onClick={() => setShowModali(false)}>
          <div className="modal-conten" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select an Avatar</h3>
            </div>

            <div className="modal-body">
              <div className="avatar-selection">
                {Object.keys(imageData.hashtags).map((category) => (
                  <div key={category} className="avatar-category">
                    <h4>{category}</h4>
                    <div className="avatar-images">
                      {imageData.hashtags[category].images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${category}-${idx}`}
                          onClick={() => setNewAvatar(img)}
                          className={`avatar-image ${
                            newAvatar === img ? "selected" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModali(false)}>Close</button>
              <button
                onClick={() => {
                  handleSave();
                  setShowModali(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className="modal-title">Display Name & Bio</h2>

            <div className="input-wrapper">
              <label htmlFor="displayName">Display name</label>
              <input
                type="text"
                id="displayName"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter display name"
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="bio">Bio</label>
              <input
                type="text"
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter bio"
                maxLength={100}
              />
            </div>

            <div className="char-count">{bio.length} / 100</div>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isUnchanged}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="oit">
        <div className={`oit-in ${isView ? "hidde" : "activa"}`}>
          <div className="otil">
            <div className="oit-tip">Edit</div>
          </div>

          <div className="oitt">
            <div className="oit-tit">Edit</div>
            <div className="outii" onClick={() => setIsView(true)}>
              <div className="out-lit">
                <FaEye />
              </div>
              <div className="out-lit">Preview</div>
            </div>
          </div>

          <div className="oit-2">
            <div className="oit-4">
              <div className="oster" onClick={() => setShowModali(true)}>
                <img src={newAvatar} alt="poster" />
                <button className="edit-btn" aria-label="Edit Image">
                  <HiPencil />
                </button>
              </div>
              <div>
                <div className="username" onClick={() => setShowModal(true)}>
                  {user || "username"}
                </div>
                <div className="biog" onClick={() => setShowModal(true)}>
                  {bio || "bio"}
                </div>
                {/* <div>yout</div> */}
              </div>
            </div>
            <div className="morre" onClick={() => setShowModal(true)}>
              <IoIosMore />
            </div>
          </div>
          <div className="container">
            {isAdding ? (
              <div className="add-box">
                <div className="link-header">
                  <FiLink />
                  <span>Add a New Link</span>
                </div>
                <input
                  type="text"
                  placeholder="Link Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input"
                />
                <div className="button-group">
                  <button onClick={handleAddLink} className="button">
                    Add
                  </button>
                  <button onClick={handleCancel} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="add-trigger" onClick={() => setIsAdding(true)}>
                <IoMdAdd size={20} />
                <span className="add-text">Add new Link</span>
              </div>
            )}

            {!isAdding && links.length < 1 && (
              <div className="no-links-box" onClick={handleAddReferralLink}>
                <div className="info-text">
                  Don’t have any links to add? Start by adding your referral
                  link below. <br />
                  <strong>The more you refer, the more you earn!</strong>
                </div>

                <div className="add-button">
                  <IoMdAdd size={20} />
                  <span className="add-text">Add Referral Link</span>
                </div>
              </div>
            )}

            {links.length > 0 && (
              <div className="links-wrapper">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map((link) => link.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {links.map((link, index) => (
                      <SortableItem
                        key={link.id}
                        id={link.id}
                        index={index}
                        link={link}
                        editingIndex={editingIndex}
                        editingField={editingField}
                        editingValue={editingValue}
                        setEditingIndex={setEditingIndex}
                        setEditingField={setEditingField}
                        setEditingValue={setEditingValue}
                        onSaveEdit={onSaveEdit}
                        isVisible={visibleLinks[link.id] !== false} // default true
                        toggleVisibility={() => toggleLinkVisibility(link.id)}
                        handleDelete={handleDelete} // 👈 pass it here
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff", // or your theme background
                zIndex: 1000,
                padding: "1rem",
                borderTop: "1px solid #ccc", // optional
              }}
            >
              <Share
                ShareUrl={`https://biolynk.shoko.fun/${session?.user?.id}${
                  props.refer ? `?refer=${props.refer}` : `?refer=weebhideout`
                }`}
              />
            </div>
          </div>
        </div>

        <div className={`oit-3 ${isView ? "activa" : "hidde"}`}>
          <div className="otil">
            <div className="oit-tip">Preview</div>
          </div>

          <div className="oitt">
            <div className="oit-tit">Preview</div>
            <div className="outii" onClick={() => setIsView(false)}>
              <div className="out-lit">
                <FaEyeSlash />
              </div>
              <div className="out-lit">Hide</div>
            </div>
          </div>
          <div className="inn-1">
            {/* <div className="absolute inset-0 z-10 bg-[url('https://i.postimg.cc/pVGY6RXd/thumb.png')] bg-repeat"></div> */}
            <img
              src={selectedLink || "/done.jpg"}
              alt="background"
              className="background-image"
            />

            <div className="text-over">
              <div className="banner-wrapper">
                <div
                  className="banner-ad"
                  role="banner"
                  tabIndex={0}
                  aria-label="Advertisement banner"
                >
                  <iframe
                    src={`/ad?user=${session?.user?.id}`}
                    title="Ad Banner"
                    style={{
                      width: "100%",
                      height: "90px",
                      border: "none",
                      overflow: "hidden",
                    }}
                    scrolling="no"
                  />
                </div>

                <div className="poster">
                  <img src={newAvatar} alt="poster" />
                </div>
                <div className="user">{user || "username"}</div>
                <div className="bio">{bio || "bio"}</div>
                <div className="linko">
                  {links
                    .filter((link) => visibleLinks[link.id] !== false) // only show visible links
                    .map((link, index) => (
                      <div key={index}>
                        <a
                          href={link.url}
                          className="link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.name}
                        </a>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="banner-ad2"
                role="banner"
                tabIndex={0}
                aria-label="Advertisement banner"
              >
                <iframe
                  src="/ad2"
                  title="Ad Banner"
                  style={{
                    width: "100%",
                    height: "90px",
                    border: "none",
                    overflow: "hidden",
                  }}
                  scrolling="no"
                />
              </div>
            </div>
          </div>
          <Share
            ShareUrl={`https://biolynk.shoko.fun/${session?.user?.id}${
              props.refer ? `?refer=${props.refer}` : `?refer=weebhideout`
            }`}
          />
        </div>
      </div>
      <BottomNavBar />
      <Footer />
    </>
  );
};

export default AddLink;
