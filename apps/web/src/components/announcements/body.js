import {
  Box,
  Button,
  Flex,
  Image as RebassImage,
  Text as RebassText,
} from "rebass";
import { allowedPlatforms } from "../../utils/use-announcements";
import {
  closeOpenedDialog,
  showBuyDialog,
} from "../../common/dialog-controller";
import { ANALYTICS_EVENTS, trackEvent } from "../../utils/analytics";
import * as Icon from "../icons";

var margins = [0, 2];
var HORIZONTAL_MARGIN = 3;

const features = [
  { icon: Icon.Sync, title: "Instant private sync" },
  { icon: Icon.Notebook, title: "Unlimited notebooks" },
  { icon: Icon.Tag2, title: "Unlimited tags" },
  { icon: Icon.Attachment, title: "Encrypted attachments" },
  { icon: Icon.Backup, title: "Encrypted backups" },
  { icon: Icon.Vault, title: "Secure private vault" },
  { icon: Icon.PDF, title: "Export to PDF" },
  { icon: Icon.Edit, title: "Rich text editor" },
];

export default function AnnouncementBody({
  removeAnnouncement,
  components,
  type,
}) {
  return components
    .filter((item) =>
      item.platforms.some((platform) => allowedPlatforms.indexOf(platform) > -1)
    )
    .map((item) => {
      item.style = item.style || {};

      if (type === "inline") {
        HORIZONTAL_MARGIN = 2;
        margins = [0, 1];

        switch (item.type) {
          case "title":
            return (
              <Title
                item={{ ...item, style: { ...item.style, textAlign: "left" } }}
                fontSize="subtitle"
              />
            );
          case "description":
            return (
              <Description
                item={{
                  ...item,
                  style: { ...item.style, textAlign: "left", marginTop: 1 },
                }}
                fontSize="body"
                color="icon"
              />
            );
          case "callToActions":
            return <InlineCalltoActions item={item} />;
          case "text":
            return (
              <Text
                value={item.value}
                sx={mapStyle(item.style)}
                mx={HORIZONTAL_MARGIN}
              />
            );
          default:
            return null;
        }
      } else if (type === "dialog") {
        HORIZONTAL_MARGIN = 3;
        margins = [0, 2];

        switch (item.type) {
          case "image":
            return <Image item={item} />;
          case "list":
            return <List item={item} />;
          case "title":
            return <Title item={item} />;
          case "subheading":
            return <Title item={item} fontSize={"title"} />;
          case "description":
            return <Description item={item} fontSize="subtitle" />;
          case "callToActions":
            return (
              <CalltoActions
                item={item}
                removeAnnouncement={removeAnnouncement}
              />
            );
          case "features":
            return <Features item={item} />;
          case "text":
            return (
              <Text
                value={item.value}
                sx={mapStyle(item.style)}
                mx={HORIZONTAL_MARGIN}
              />
            );
          default:
            return null;
        }
      }
      return null;
    });
}

function Image({ item }) {
  const { src, style } = item;
  return (
    <RebassImage
      src={src}
      maxHeight="150px"
      sx={{
        objectFit: "cover",
        ...mapStyle(style),
      }}
    />
  );
}

function List({ item }) {
  const { items, listType, style } = item;
  return (
    <Flex
      as={listType || "ul"}
      mt={1}
      sx={mapStyle(style)}
      flexDirection="column"
    >
      {items.map((item) => (
        <ListItem item={item} />
      ))}
    </Flex>
  );
}

function ListItem({ item }) {
  const { text } = item;
  return <Text as="li" value={text} />;
}

function Title({ item, fontSize }) {
  const { text, style } = item;
  return (
    <Text
      value={text.toUpperCase()}
      variant="heading"
      mx={HORIZONTAL_MARGIN}
      fontSize={fontSize}
      sx={mapStyle(style)}
    />
  );
}

function Description({ item, fontSize, color }) {
  const { text, style } = item;
  return (
    <Text
      value={text}
      variant="body"
      fontWeight="normal"
      fontSize={fontSize}
      color={color || "fontTertiary"}
      mx={HORIZONTAL_MARGIN}
      sx={mapStyle(style)}
    />
  );
}

function Text({ value, ...restProps }) {
  return (
    <RebassText className="selectable" variant={"body"} {...restProps}>
      {value}
    </RebassText>
  );
}

function CalltoActions({ item, removeAnnouncement }) {
  const { actions, style } = item;
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      // bg="bgSecondary"
      px={2}
      pb={2}
      sx={mapStyle(style)}
    >
      {actions
        ?.filter((cta) =>
          cta.platforms.some(
            (platform) => allowedPlatforms.indexOf(platform) > -1
          )
        )
        .map((action, index) => (
          <CalltoAction
            action={action}
            index={index}
            variant={
              index === 0
                ? "primary"
                : index === 1
                ? "secondary"
                : index === 2
                ? "tertiary"
                : "shade"
            }
            sx={{
              ":first-of-type": {
                mr: 1,
              },
            }}
            removeAnnouncement={removeAnnouncement}
          />
        ))}
    </Flex>
  );
}

function InlineCalltoActions({ item }) {
  const { actions, style } = item;
  return (
    <Flex px={2} sx={mapStyle(style)}>
      {actions
        ?.filter((cta) =>
          cta.platforms.some(
            (platform) => allowedPlatforms.indexOf(platform) > -1
          )
        )
        .map((action, index) => (
          <CalltoAction
            key={action.title}
            action={action}
            variant={"anchor"}
            sx={{
              textDecoration: "underline",
              textDecorationLine: "underline",
              textDecorationColor:
                index === 0 ? "var(--dimPrimary)" : "var(--bgSecondary)",
              color: index === 0 ? "primary" : "fontTertiary",
              fontWeight: "bold",
              ":first-of-type": {
                mr: 1,
              },
            }}
          />
        ))}
    </Flex>
  );
}

function CalltoAction({ action, variant, sx, removeAnnouncement }) {
  return (
    <Button
      as={action.type === "link" ? "a" : "button"}
      href={action.type === "link" ? action.data : ""}
      target="_blank"
      variant={variant}
      sx={sx}
      onClick={async () => {
        removeAnnouncement();
        closeOpenedDialog();
        trackEvent(ANALYTICS_EVENTS.announcementCta, action.data);
        switch (action.type) {
          case "link":
            const url = new URL(action.data);
            if (url.origin === window.location.origin)
              window.open(action.data, "_self");
            break;
          case "promo":
            const [coupon, plan] = action.data.split(":");
            await showBuyDialog(plan, coupon);
            break;
          default:
            return;
        }
      }}
    >
      {action.title}
    </Button>
  );
}

export function Features({ item }) {
  const { style } = item;
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: 1,
        rowGap: 1,
        mx: HORIZONTAL_MARGIN,
        ...mapStyle(style),
      }}
    >
      {features.map((feature) => (
        <Flex
          key={feature.title}
          p={1}
          sx={{
            borderRadius: "default",
            border: "1px solid var(--border)",
          }}
        >
          <feature.icon size={16} sx={{ alignSelf: "start" }} />
          <RebassText variant="body" ml={1}>
            {feature.title}
          </RebassText>
        </Flex>
      ))}
    </Box>
  );
}

function mapStyle(style) {
  return {
    mt: margins[style.marginTop],
    mb: margins[style.marginBottom],
    textAlign: style.textAlign,
  };
}