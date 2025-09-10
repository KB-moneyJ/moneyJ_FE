import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  ItemList,
  Item,
  Label,
  ModalContent,
  Header,
  Title,
  CleanInput,
  CleanInput2,
  DeleteButton,
  ItemWrapper,
  Item2,
  AddButton
} from '../../pages/StartPlan/PlanCard/PlanCardStyle';
import { Check, X } from "lucide-react";

interface ExpenseItem {
  id: string;
  label: string;
  amount: number;
  icon: React.ReactNode;
}

interface EditModalProps {
  tripId: number;  // ← 추가
  items: ExpenseItem[];
  coveredSet: Set<string>;
  onSave: (updatedItems: ExpenseItem[]) => void;
  onClose: () => void;
}


export default function EditModal({ items, coveredSet, onSave, onClose }: EditModalProps) {
  const [localItems, setLocalItems] = useState<ExpenseItem[]>(items);

  const total = localItems.reduce((sum, i) => sum + i.amount, 0);

  const handleAmountChange = (id: string, value: string) => {
    const numericValue = Number(value.replace(/,/g, "")) || 0;
    setLocalItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, amount: numericValue } : i
      )
    );
  };

  const handleLabelChange = (id: string, value: string) => {
    setLocalItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, label: value } : i
      )
    );
  };

  const handleAddCategory = () => {
    const newId = `custom-${Date.now()}`;
    setLocalItems((prev) => [
      ...prev,
      {
        id: newId,
        label: "기타",
        amount: 0,
        icon: (
          <svg
            width="18"
            height="25"
            viewBox="0 0 18 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* svg 내용 그대로 */}
          </svg>
        ),
      },
    ]);
  };

  const handleDeleteCategory = (id: string) => {
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    onSave(localItems);
    onClose();
  };

  // 🔥 Portal을 사용해서 body에 직접 붙이기
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <ModalContent>
        <Header>
          <div style={{ height: "30px" }}>
            <Title>예상 1인 경비</Title>
          </div>
          <button
            onClick={onClose}
            style={{
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <X size={28} style={{ color: "white" }} />
          </button>
        </Header>

        <CleanInput2 type="text" value={total.toLocaleString()} readOnly />

        <ItemList>
          {localItems.map((i) => {
            const covered = coveredSet.has(i.id);
            const isCustom = i.id.startsWith("custom-");

            return (
              <ItemWrapper key={i.id}>
                <Item2 $covered={covered}>
                  <Label>
                    {i.icon}
                    {isCustom ? (
                      <select
                        value={i.label}
                        onChange={(e) => handleLabelChange(i.id, e.target.value)}
                        style={{
                          padding: "2px",
                          borderRadius: "50px",
                          border: "1px solid #ccc",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        <option value="액티비티">액티비티</option>
                        <option value="투어">투어</option>
                        <option value="쇼핑">쇼핑</option>
                        <option value="기타">기타</option>
                      </select>
                    ) : (
                      <span>{i.label}</span>
                    )}
                  </Label>
                  <CleanInput
                    type="text"
                    value={i.amount.toLocaleString()}
                    onChange={(e) => handleAmountChange(i.id, e.target.value)}
                  />
                </Item2>

                {isCustom && (
                  <DeleteButton onClick={() => handleDeleteCategory(i.id)}>
                    <X size={30} />
                  </DeleteButton>
                )}
              </ItemWrapper>
            );
          })}
        </ItemList>

        <AddButton onClick={handleAddCategory}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8C16 8.25461 15.8989 8.49879 15.7188 8.67882C15.5388 8.85886 15.2946 8.96 15.04 8.96H8.96V15.04C8.96 15.2946 8.85886 15.5388 8.67882 15.7188C8.49879 15.8989 8.25461 16 8 16C7.74539 16 7.50121 15.8989 7.32118 15.7188C7.14114 15.5388 7.04 15.2946 7.04 15.04V8.96H0.96C0.705392 8.96 0.461212 8.85886 0.281178 8.67882C0.101143 8.49879 0 8.25461 0 8C0 7.74539 0.101143 7.50121 0.281178 7.32118C0.461212 7.14114 0.705392 7.04 0.96 7.04H7.04V0.96C7.04 0.705392 7.14114 0.461212 7.32118 0.281178C7.50121 0.101143 7.74539 0 8 0C8.25461 0 8.49879 0.101143 8.67882 0.281178C8.85886 0.461212 8.96 0.705392 8.96 0.96V7.04H15.04C15.2946 7.04 15.5388 7.14114 15.7188 7.32118C15.8989 7.50121 16 7.74539 16 8Z"
              fill="white"
            />
          </svg>
        </AddButton>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              width: "88px",
              height: "45px",
              borderRadius: "8px",
              backgroundColor: "#A730B0",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            저장
          </button>
        </div>
      </ModalContent>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999; /* 최상단 보장 */
        }
      `}</style>
    </div>,
    document.body
  );
}
