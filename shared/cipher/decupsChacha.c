#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <wolfssl/wolfcrypt/chacha20_poly1305.h>

napi_value DecryptMessage(napi_env env, napi_callback_info info)
{
    napi_status status;

    // Проверяем количество аргументов
    size_t argc = 4;
    napi_value argv[4];
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (status != napi_ok || argc < 4)
    {
        napi_throw_error(env, NULL, "Ожидались четыре аргумента: cipher, block, authTag и sharedSecretBuffer.");
        return NULL;
    }

    // Получаем cipher из первого аргумента
    size_t cipherLength;
    unsigned char *cipherData;
    status = napi_get_buffer_info(env, argv[0], (void **)&cipherData, &cipherLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из cipher.");
        return NULL;
    }

    // Получаем block из второго аргумента
    size_t blockLength;
    unsigned char *blockData;
    status = napi_get_buffer_info(env, argv[1], (void **)&blockData, &blockLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из block.");
        return NULL;
    }

    // Получаем authTag из третьего аргумента
    size_t authTagLength;
    unsigned char *authTagData;
    status = napi_get_buffer_info(env, argv[2], (void **)&authTagData, &authTagLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из authTag.");
        return NULL;
    }

    // Получаем sharedSecretBuffer из четвертого аргумента
    size_t sharedSecretLength;
    unsigned char *sharedSecretData;
    status = napi_get_buffer_info(env, argv[3], (void **)&sharedSecretData, &sharedSecretLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из sharedSecretBuffer.");
        return NULL;
    }
    unsigned char *shared_secret = calloc(32, 1);
    for (size_t i = 0; i < 32; i++)
    {
        shared_secret[i] = sharedSecretData[i];
    }

    printf("shared_secret в decript: %s\n", sharedSecretData);
    printf("длина shared_secret в decript: %d\n", sharedSecretLength);

    printf("длина authTagData: %d\n", authTagLength);
    printf("authTagData: %s\n", authTagData);

    printf("block in encipt: %s\n", blockData);

    printf("cipherData in encipt: %s\n", cipherData);
    printf("Длина cipherData в encipt: %d\n", cipherLength);

    // Выполняем расшифровку
    unsigned char *authTag = calloc(16, 1);
    for (size_t i = 0; i < 16; i++)
    {
        authTag[i] = authTagData[i];
    }
    unsigned char *inAAD = "";
    char *mess = (char *)calloc(cipherLength + 1, 1);

    int ch = wc_ChaCha20Poly1305_Decrypt(shared_secret, blockData, inAAD, 0, cipherData, cipherLength, authTag, mess);
    if (ch != 0)
    {
        printf("%d\n", ch);
        napi_throw_error(env, NULL, "Ошибка при расшифровании.");
        free(mess);
        return NULL;
    }

    // Создаем буфер Node.js для возврата расшифрованного сообщения
    napi_value decryptedMessageBuffer;
    status = napi_create_string_utf8(env, mess, NAPI_AUTO_LENGTH, &decryptedMessageBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для расшифрованного сообщения.");
        free(mess);
        return NULL;
    }

    // Освобождаем выделенную память
    free(mess);

    return decryptedMessageBuffer;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, DecryptMessage, NULL, &fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании функции");
        return NULL;
    }

    status = napi_set_named_property(env, exports, "DecryptMessage", fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке функции");
        return NULL;
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
