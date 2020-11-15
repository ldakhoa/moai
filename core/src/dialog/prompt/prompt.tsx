import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "../../button/button";
import { DivPx } from "../../div/div";
import { Input } from "../../input/input";
import { TextArea } from "../../text-area/text-area";
import { Dialog } from "../dialog";
import { DialogMessage, DialogMessageC } from "../message/message";
import s from "./prompt.module.scss";

interface Props {
	children: DialogMessage;
	initialText?: string;
	useTextArea?: boolean;
	onOk: (text: string) => void;
	onCancel: () => void;
}

export const PromptDialog = (props: Props) => {
	const [text, setText] = React.useState<string>(props.initialText ?? "");
	return (
		<Dialog onEsc={props.onCancel}>
			<div className={s.container}>
				<Dialog.Body>
					<DialogMessageC children={props.children} />
					<DivPx size={16} />
					{props.useTextArea ? (
						<TextArea
							autoFocus
							autoSelect
							value={text}
							setValue={setText}
							rows={3}
						/>
					) : (
						<Input
							autoFocus
							autoSelect
							value={text}
							setValue={setText}
						/>
					)}
				</Dialog.Body>
				<Dialog.Footer>
					<Button onClick={props.onCancel} children="Cancel" />
					<DivPx size={16} />
					<Button
						highlight
						onClick={() => props.onOk(text)}
						children="OK"
					/>
				</Dialog.Footer>
			</div>
		</Dialog>
	);
};

const container = document.createElement("div");
document.body.appendChild(container);

const unmount = () => {
	const result = ReactDOM.unmountComponentAtNode(container);
	if (result === false) throw Error("No prompt to unmount");
};

export const showPrompt = (
	message: DialogMessage,
	initialText?: string,
	useTextArea?: boolean
): Promise<string | null> => {
	return new Promise((resolve) => {
		const dialog = (
			<PromptDialog
				onCancel={() => {
					resolve(null);
					unmount();
				}}
				onOk={(text) => {
					resolve(text);
					unmount();
				}}
				initialText={initialText}
				children={message}
				useTextArea={useTextArea}
			/>
		);
		ReactDOM.render(dialog, container);
	});
};